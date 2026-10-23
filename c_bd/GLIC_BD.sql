CREATE DATABASE IF NOT EXISTS glic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE glic;

-- 1. Tabela usuario
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT(10) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('ADMIN', 'GERENTE', 'FUNCIONARIO') NOT NULL,
    ativo TINYINT(1) NOT NULL,
    data_criacao DATETIME NOT NULL,
    foto LONGTEXT
);

-- 2. Tabela produto
CREATE TABLE IF NOT EXISTS produto (
    id_produto INT(10) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(200),
    categoria VARCHAR(100) NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT(10) NOT NULL,
    estoque_minimo INT(10) NOT NULL,
    ativo TINYINT(1) NOT NULL,
    marca VARCHAR(80),
    fornecedor VARCHAR(100),
    unidade VARCHAR(20) DEFAULT 'un.',
    imagem LONGTEXT
);

-- 3. Tabela entrada_estoque
CREATE TABLE IF NOT EXISTS entrada_estoque (
    id_entrada INT(10) AUTO_INCREMENT PRIMARY KEY,
    id_produto INT(10) NOT NULL,
    data_entrada DATETIME NOT NULL,
    quantidade INT(10) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    fornecedor VARCHAR(100),
    observacao VARCHAR(200),
    CONSTRAINT fk_entrada_produto
        FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

-- 4. Tabela venda
CREATE TABLE IF NOT EXISTS venda (
    id_venda INT(10) AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT(10),
    data_venda DATETIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) NOT NULL,
    forma_pagamento ENUM('DINHEIRO', 'CARTAO', 'PIX', 'CREDIARIO'),
    observacao VARCHAR(200),
    CONSTRAINT fk_venda_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- 5. Tabela item_venda
CREATE TABLE IF NOT EXISTS item_venda (
    id_item_venda INT(10) AUTO_INCREMENT PRIMARY KEY,
    id_venda INT(10) NOT NULL,
    id_produto INT(10) NOT NULL,
    quantidade INT(10) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_venda
        FOREIGN KEY (id_venda) REFERENCES venda(id_venda) ON DELETE CASCADE,
    CONSTRAINT fk_item_produto
        FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

-- 6. Tabela movimentacao_financeira
CREATE TABLE IF NOT EXISTS movimentacao_financeira (
    id_movimentacao INT(10) AUTO_INCREMENT PRIMARY KEY,
    id_venda INT(10),
    tipo ENUM('RECEITA', 'DESPESA') NOT NULL,
    data_movimentacao DATETIME NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    forma_pagamento ENUM('DINHEIRO', 'CARTAO', 'PIX', 'TRANSFERENCIA'),
    valor DECIMAL(10,2) NOT NULL,
    observacao VARCHAR(200),
    CONSTRAINT fk_movimentacao_venda
        FOREIGN KEY (id_venda) REFERENCES venda(id_venda)
);

-- 7. Tabela despesa
CREATE TABLE IF NOT EXISTS despesa (
    id_despesa INT(10) AUTO_INCREMENT PRIMARY KEY,
    id_movimentacao INT(10),
    categoria VARCHAR(100) NOT NULL,
    fornecedor VARCHAR(100),
    data_vencimento DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    status ENUM('PENDENTE', 'PAGA') NOT NULL,
    observacao VARCHAR(200),
    CONSTRAINT fk_despesa_movimentacao
        FOREIGN KEY (id_movimentacao) REFERENCES movimentacao_financeira(id_movimentacao)
);

