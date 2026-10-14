/* Validação local sem dependências: Chrome headless em perfil temporário.
 * Uso: node validation/visual.cjs [caminho-do-chrome.exe]
 * Requer Vite em http://127.0.0.1:5173. Não utiliza perfis pessoais.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const output = path.join(__dirname, 'evidence');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dsom-visual-'));
const chrome = process.argv[2] || path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe');
const child = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-background-networking', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let ws, serial = 0;
const pending = new Map();
const exceptions = [];
const results = [];
const interactions = [];
const sizes = [[375,812],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]];
function send(method, params = {}) {
  const id = ++serial;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: err => { clearTimeout(timer); reject(err); } });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression) {
  for (let i = 0; i < 80; i++) {
    if (await evaluate(expression)) return;
    await pause(100);
  }
  throw new Error(`Condição não atendida: ${expression}`);
}
async function click(selector) {
  await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e || e.disabled) throw new Error('Controle indisponível: ' + ${JSON.stringify(selector)}); e.click(); })()`);
  await pause(80);
}
async function fill(selector, value) {
  await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); const proto = e.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, ${JSON.stringify(value)}); e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await pause(80);
}
async function navigate(route, selector) {
  await evaluate(`history.pushState(null, '', ${JSON.stringify(route)}); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0);`);
  await until(`Boolean(document.querySelector(${JSON.stringify(selector)}))`);
  await pause(450);
}
async function login(role) {
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/login' });
  await until("Boolean(document.querySelector('#login-email'))");
  await fill('#login-email', `${role}@glic.local`);
  await fill('#login-senha', 'Glic123!');
  await click('.pagina-login button[type=submit]');
  await until("Boolean(document.querySelector('.pagina-dashboard .ui-graficos')) && !document.querySelector('.ui-kpi[aria-busy=true]')");
  interactions.push(`Login ${role}: aprovado`);
}
async function trocarUsuario(role) {
  await click('.layout-interno > .menu-lateral .menu-lateral__sair');
  await until("Boolean(document.querySelector('#login-email'))");
  await fill('#login-email', `${role}@glic.local`);
  await fill('#login-senha', 'Glic123!');
  await click('.pagina-login button[type=submit]');
  await until("Boolean(document.querySelector('.pagina-dashboard .ui-graficos')) && !document.querySelector('.ui-kpi[aria-busy=true]')");
  interactions.push(`Troca de sessão para ${role} sem recarregar os mocks: aprovada`);
}
async function capture(name, width, height, screenshot = true) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await evaluate('window.scrollTo(0, 0)');
  await pause(await evaluate('Boolean(document.querySelector(".recharts-wrapper"))') ? 1800 : 250);
  const geometry = await evaluate(`(() => {
    const rect = selector => { const e = document.querySelector(selector); if(!e) return null; const r = e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
    const root = document.documentElement;
    const outside = [...document.querySelectorAll('body *')].filter(e => {
      const r = e.getBoundingClientRect(); if(!r.width || !r.height || getComputedStyle(e).position === 'absolute') return false;
      if(e.closest('.ui-tabela__rolagem, .ui-abas, .recharts-wrapper')) return false;
      return r.right > innerWidth + 1 || r.left < -1;
    }).slice(0,12).map(e => e.className || e.tagName);
    return {page: location.pathname, viewport:innerWidth,scrollWidth:root.scrollWidth,clientWidth:root.clientWidth,outside,header:rect('.cabecalho'),menu:rect('.layout-interno > .menu-lateral'),kpi:rect('.ui-kpi'),kpiColumns:document.querySelector('.dashboard__kpis') ? getComputedStyle(document.querySelector('.dashboard__kpis')).gridTemplateColumns : null};
  })()`);
  results.push({ name, width, height, ...geometry });
  assert.ok(geometry.scrollWidth <= geometry.clientWidth + 1, `${name} ${width}: overflow ${geometry.scrollWidth}/${geometry.clientWidth}`);
  assert.equal(geometry.outside.length, 0, `${name} ${width}: elementos fora da viewport: ${JSON.stringify(geometry.outside)}`);
  if (width >= 1024 && geometry.kpiColumns) assert.equal(geometry.kpiColumns.split(' ').length, 4);
  if (screenshot) {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(output, `${name}-${width}.png`), Buffer.from(shot.data, 'base64'));
  }
}
async function matrix(name) {
  for (const [w,h] of sizes) await capture(name,w,h);
  await send('Emulation.setDeviceMetricsOverride', {width:1366,height:768,deviceScaleFactor:1,mobile:false});
}
async function run() {
  fs.mkdirSync(output, {recursive:true});
  const activePort = path.join(profile, 'DevToolsActivePort');
  for(let i=0; i<100 && !fs.existsSync(activePort); i++) await pause(100);
  const port = Number(fs.readFileSync(activePort,'utf8').split('\n')[0]);
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = pages.find(p=>p.type==='page');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if(msg.id && pending.has(msg.id)) {
      const request = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? request.reject(new Error(JSON.stringify(msg.error))) : request.resolve(msg.result);
    } else if(msg.method==='Runtime.exceptionThrown') exceptions.push(msg.params.exceptionDetails);
  };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {width:1366,height:768,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate', {url:'http://127.0.0.1:5173/login'});
  await until("Boolean(document.querySelector('#login-email'))");
  await matrix('login');
  await navigate('/cadastro','.pagina-cadastro');
  await matrix('cadastro');
  await click('.pagina-cadastro button[type=submit]');
  await until("document.querySelectorAll('.ui-campo--erro').length === 4");
  await capture('cadastro-validacao',375,812);
  interactions.push('Cadastro: validação obrigatória preservada');
  await login('funcionario');
  await matrix('dashboard-vazio');
  await click('.cabecalho__acoes .ui-segmentado__opcao:nth-child(2)');
  await until("document.querySelector('.cabecalho__acoes .ui-segmentado__opcao--ativa')?.textContent === '7 dias' && !document.querySelector('.ui-kpi[aria-busy=true]')");
  interactions.push('Filtro de período no cabeçalho: aprovado');
  await navigate('/estoque','.pagina-estoque');
  await matrix('estoque-vazio');
  await click('.estoque__produto');
  await until("Boolean(document.querySelector('.estoque__produto-resumo'))");
  await matrix('estoque-selecionado');
  await click('#aba-movimentacoes');
  await until("document.querySelector('#aba-movimentacoes').getAttribute('aria-selected') === 'true'");
  await click('#aba-fornecedores'); await click('#aba-geral');
  await fill('.estoque__busca input','Multimídia');
  assert.equal(await evaluate("document.querySelectorAll('.estoque__produto').length"),1);
  await fill('.estoque__busca input','');
  assert.ok(await evaluate("document.querySelector('.estoque__novo').disabled && document.querySelector('.estoque__acoes button').disabled"));
  interactions.push('Estoque: seleção, abas e pesquisa; Novo/Editar permanecem desabilitados');
  await navigate('/nova-venda','.pagina-nova-venda');
  await matrix('nova-venda-vazia');
  await click('.cabecalho__acoes button');
  await until("Boolean(document.querySelector('.dialogo-venda'))");
  assert.ok(await evaluate("document.querySelector('.dialogo-venda')?.textContent.includes('Nenhum item selecionado')"));
  await click('.dialogo-venda__fechar');
  await click('.nova-venda__secao--servico .nova-venda__opcao:nth-child(2)');
  await click('.nova-venda__resumo-topo button');
  await until("Boolean(document.querySelector('.dialogo-venda'))");
  await click('.dialogo-venda .dialogo-venda__acoes button:last-child');
  assert.equal(await evaluate("document.querySelector('.nova-venda__opcao[aria-pressed=true]')"),null);
  interactions.push('Nova venda: orçamento e limpeza confirmada sem efeitos colaterais');
  await click('.nova-venda__secao--servico .nova-venda__opcao:first-child');
  await click('.nova-venda__secao--tipoVeiculo .nova-venda__opcao:first-child');
  await click('.nova-venda__secao--area .nova-venda__opcao:first-child');
  await click('.nova-venda__produto:first-child');
  await click('.nova-venda__produto:nth-child(2)');
  await fill('.nova-venda__quantidade input','2');
  await fill('.nova-venda__valores input','10');
  await matrix('nova-venda-preenchida');
  await click('.nova-venda__acoes button:first-child');
  await until("document.querySelector('.ui-alerta')?.textContent.includes('Rascunho')");
  await navigate('/estoque','.pagina-estoque');
  assert.ok(await evaluate("document.querySelector('.estoque__produto')?.textContent.includes('12')"),'Rascunho alterou estoque');
  await navigate('/vendas','.pagina-vendas');
  await until("document.querySelector('.vendas__status')?.textContent.includes('Rascunho')");
  await matrix('vendas-rascunho');
  await click('.vendas__retomar');
  await until("document.querySelectorAll('.nova-venda__itens li').length === 2");
  assert.equal(await evaluate("document.querySelector('.nova-venda__quantidade input').value"),'2');
  interactions.push('Rascunho: salvo, listado e retomado sem baixa de estoque');
  await click('.nova-venda__acoes button:last-child');
  await until("Boolean(document.querySelector('.nova-venda__confirmacao'))");
  await capture('nova-venda-confirmacao',1366,768);
  await capture('nova-venda-confirmacao',375,812);
  await click('.nova-venda__confirmacao button:last-child');
  await until("Boolean(document.querySelector('.pagina-nova-venda .ui-alerta--sucesso'))");
  await capture('nova-venda-sucesso',1366,768);
  assert.ok(await evaluate("document.querySelector('.ui-alerta--sucesso').textContent.includes('Estoque atualizado')"));
  assert.ok(await evaluate("document.querySelector('.nova-venda__acoes button:last-child').disabled"));
  interactions.push('Venda mock: configurações, quantidades, desconto, confirmação e finalização única aprovados');
  await navigate('/vendas','.pagina-vendas');
  await matrix('vendas');
  assert.ok(await evaluate("document.querySelector('.vendas__status')?.textContent.includes('Finalizada')"));
  assert.ok(await evaluate("document.querySelector('.ui-tabela')?.textContent.includes('Não informado')"));
  await click('.vendas__detalhes-botao');
  await capture('vendas-detalhes',375,812);
  await click('.vendas__fechar');
  interactions.push('Vendas: listagem e detalhes aprovados');
  await navigate('/dashboard','.pagina-dashboard');
  await until("Boolean(document.querySelector('.pagina-dashboard .ui-graficos'))");
  await pause(1600);
  await capture('dashboard-preenchido',1366,768);
  await click('.ui-graficos__dados summary');
  await capture('dashboard-tabela',375,812);
  await navigate('/perfil','.pagina-perfil');
  await matrix('perfil');
  await click('.menu-perfil__gatilho');
  await capture('perfil-menu',1366,768);
  await capture('perfil-menu',375,812);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await until("!document.querySelector('.menu-perfil__painel')");
  await click('.cabecalho__menu');
  await capture('menu-mobile',375,812);
  await click('.cabecalho__fundo');
  interactions.push('Perfil: menu aberto/fechado por Escape; gaveta mobile aberta/fechada');
  await trocarUsuario('gestor');
  await navigate('/vendas','.pagina-vendas');
  assert.ok(await evaluate("Boolean(document.querySelector('.vendas__nova-venda'))"));
  await click('.vendas__nova-venda');
  await until("Boolean(document.querySelector('.pagina-nova-venda'))");
  assert.equal(await evaluate('location.pathname'),'/nova-venda');
  interactions.push('Gestor: acesso à Nova venda e ação de cadastro disponíveis');
  await navigate('/dashboard','.pagina-dashboard');
  await until("Boolean(document.querySelector('.dashboard__historico'))");
  await click('.dashboard__historico summary');
  assert.ok(await evaluate("document.querySelector('.dashboard__historico')?.textContent.includes('Venda V-')"));
  await navigate('/financeiro','.pagina-dashboard');
  assert.equal(await evaluate('location.pathname'),'/dashboard');
  interactions.push('Financeiro: histórico preservado no Dashboard; rota independente removida');
  await navigate('/usuarios','.pagina-usuarios');
  await matrix('usuarios');
  await click('.usuarios__cabecalho button');
  await capture('usuarios-cadastro',375,812);
  await click('.usuarios__fechar');
  await click('.usuarios__editar');
  await capture('usuarios-edicao',1366,768);
  await click('.usuarios__fechar');
  await fill('.usuarios__barra input','Cláudio');
  assert.equal(await evaluate("document.querySelectorAll('.ui-tabela tbody tr').length"),1);
  interactions.push('Usuários: pesquisa e abertura/fechamento dos modais de cadastro e edição');
  assert.equal(exceptions.length,0,JSON.stringify(exceptions));
  console.log(`Aprovado: ${results.length} verificações de viewport; ${interactions.length} grupos de interações; sem exceções JavaScript.`);
}
run().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({results,interactions,exceptions},null,2));
  if(ws?.readyState===WebSocket.OPEN) { try { await send('Browser.close'); } catch {} ws.close(); }
  child.kill();
  await pause(400);
  // Apenas o perfil temporário criado por este processo.
  if(path.dirname(profile)===os.tmpdir() && path.basename(profile).startsWith('dsom-visual-')) {
    try { fs.rmSync(profile,{recursive:true,force:true}); } catch {}
  }
});
