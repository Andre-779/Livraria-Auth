CREATE DATABASE system_auth;

USE system_auth;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

SELECT * FROM usuarios;


ALTER TABLE usuarios ADD COLUMN google_id VARCHAR(255) UNIQUE AFTER id;
ALTER TABLE usuarios ADD COLUMN provedor VARCHAR(20) DEFAULT 'formulario';

ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255) DEFAULT NULL AFTER google_id;

ALTER TABLE usuarios MODIFY senha VARCHAR(255) NOT NULL;

CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    cep CHAR(8) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    CONSTRAINT fk_enderecos_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
);

SELECT * FROM enderecos;

ALTER TABLE usuarios ADD COLUMN foto VARCHAR(255) NULL;

ALTER TABLE usuarios MODIFY COLUMN senha VARCHAR(255) NULL;


DELETE FROM usuarios WHERE id = 7;