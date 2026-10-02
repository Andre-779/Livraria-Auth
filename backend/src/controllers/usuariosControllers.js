import db from '../config/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pkg from 'google-auth-library';

const { OAuth2Client } = pkg;

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// =====================================================
// GERAR TOKEN
// =====================================================

export const gerarToken = async (usuario) => {

    const payload = {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'fallback_secret_mude_isso',
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '2h'
        }
    );

    return {
        token,
        payload
    };
};


// =====================================================
// VALIDAR ENDEREÇO
// =====================================================

export const validarEndereco = async (endereco) => {

    if (!endereco) return null;

    const cep = String(endereco.cep || "").replace(/\D/g, '');

    const {
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf
    } = endereco;

    if (
        cep.length === 0 ||
        !logradouro ||
        !numero ||
        !bairro ||
        !cidade ||
        !uf
    ) {
        return null;
    }

    return {
        cep,
        logradouro,
        numero,
        complemento: complemento || null,
        bairro,
        cidade,
        uf: String(uf || "").toUpperCase()
    };
};


// =====================================================
// CADASTRAR USUÁRIO
// =====================================================

export const cadastrarUsuario = async (req, res) => {

    const {
        nome,
        email,
        senha,
        endereco
    } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios"
        });
    }

    const enderecoValido = await validarEndereco(endereco);

    if (!enderecoValido) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos obrigatórios do endereço"
        });
    }

    const conexao = await db.getConnection();

    try {

        const [existente] = await conexao.query(
            "SELECT id FROM usuarios WHERE email = ?",
            [email]
        );

        if (existente && existente.length > 0) {

            return res.status(409).json({
                mensagem: "O email já foi cadastrado"
            });
        }

        const senhaCriptor = await bcrypt.hash(senha, 10);

        await conexao.beginTransaction();

        const [resultadoUsuario] = await conexao.query(
            `
            INSERT INTO usuarios
            (nome, email, senha, role)
            VALUES (?, ?, ?, ?)
            `,
            [
                nome,
                email,
                senhaCriptor,
                "usuario"
            ]
        );

        const usuarioid = resultadoUsuario.insertId;

        await conexao.query(
            `
            INSERT INTO enderecos
            (
                usuario_id,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                usuarioid,
                enderecoValido.cep,
                enderecoValido.logradouro,
                enderecoValido.numero,
                enderecoValido.complemento,
                enderecoValido.bairro,
                enderecoValido.cidade,
                enderecoValido.uf
            ]
        );

        await conexao.commit();

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso"
        });

    } catch (error) {

        await conexao.rollback();

        console.log(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário"
        });

    } finally {

        conexao.release();
    }
};


// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {

    try {

        const {
            email,
            senha
        } = req.body;

        if (!email || !senha) {

            return res.status(400).json({
                mensagem: "Todos os campos são obrigatórios"
            });
        }

        const [resultado] = await db.query(
            `
            SELECT
                u.*,
                e.cep,
                e.logradouro,
                e.numero,
                e.complemento,
                e.bairro,
                e.cidade,
                e.uf
            FROM usuarios u
            LEFT JOIN enderecos e
                ON u.id = e.usuario_id
            WHERE u.email = ?
            `,
            [email]
        );

        if (resultado.length === 0) {

            return res.status(401).json({
                mensagem: "Email ou senha inválidos"
            });
        }

        const usuario = resultado[0];

        // Conta criada pelo Google
        if (!usuario.senha && usuario.google_id) {

            return res.status(401).json({
                mensagem: "Esta conta foi criada com o Google. Faça login pelo Google."
            });
        }

        const senhaConfere = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaConfere) {

            return res.status(401).json({
                mensagem: "Email ou senha inválidos"
            });
        }

        const {
            token,
            payload
        } = await gerarToken(usuario);

        return res.status(200).json({

            mensagem: "Login realizado com sucesso",

            token,

            usuario: {

                id: usuario.id,

                nome: usuario.nome,

                email: usuario.email,

                role: usuario.role,

                foto: usuario.foto,

                endereco: usuario.cep
                    ? {

                        cep: usuario.cep,

                        logradouro: usuario.logradouro,

                        numero: usuario.numero,

                        complemento: usuario.complemento,

                        bairro: usuario.bairro,

                        cidade: usuario.cidade,

                        uf: usuario.uf

                    }
                    : null
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Erro ao fazer login"
        });
    }
};


// =====================================================
// LOGIN GOOGLE
// =====================================================

export const loginGoogle = async (req, res) => {

    const {
        credencial
    } = req.body;

    if (!credencial) {

        return res.status(400).json({
            mensagem: "Token do Google não enviado"
        });
    }

    try {

        const ticket = await googleClient.verifyIdToken({

            idToken: credencial,

            audience: process.env.GOOGLE_CLIENT_ID

        });

        const dadosGoogle = ticket.getPayload();

        if (!dadosGoogle.email_verified) {

            return res.status(401).json({
                mensagem: "Email do Google não verificado"
            });
        }

        const [resultado] = await db.query(
            `
            SELECT
                u.*,
                e.cep,
                e.logradouro,
                e.numero,
                e.complemento,
                e.bairro,
                e.cidade,
                e.uf
            FROM usuarios u
            LEFT JOIN enderecos e
                ON u.id = e.usuario_id
            WHERE u.google_id = ?
               OR u.email = ?
            `,
            [
                dadosGoogle.sub,
                dadosGoogle.email
            ]
        );

        let usuario;

        if (resultado.length > 0) {

            usuario = resultado[0];

            if (!usuario.google_id) {

                await db.query(
                    `
                    UPDATE usuarios
                    SET google_id = ?, foto = ?
                    WHERE id = ?
                    `,
                    [
                        dadosGoogle.sub,
                        dadosGoogle.picture || null,
                        usuario.id
                    ]
                );

                usuario.google_id = dadosGoogle.sub;

                usuario.foto = dadosGoogle.picture || null;
            }

        } else {

            const [novo] = await db.query(
                `
                INSERT INTO usuarios
                (
                    nome,
                    email,
                    senha,
                    role,
                    google_id,
                    provedor,
                    foto
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    dadosGoogle.name || dadosGoogle.nome,

                    dadosGoogle.email,

                    null,

                    "usuario",

                    dadosGoogle.sub,

                    "google",

                    dadosGoogle.picture || null
                ]
            );

            usuario = {

                id: novo.insertId,

                nome: dadosGoogle.name || dadosGoogle.nome,

                email: dadosGoogle.email,

                role: "usuario",

                foto: dadosGoogle.picture || null,

                cep: null
            };
        }

        const {
            token
        } = await gerarToken(usuario);

        return res.status(200).json({

            mensagem: "Login com o Google realizado com sucesso",

            token,

            usuario: {

                id: usuario.id,

                nome: usuario.nome,

                email: usuario.email,

                role: usuario.role,

                foto: usuario.foto,

                endereco: usuario.cep
                    ? {

                        cep: usuario.cep,

                        logradouro: usuario.logradouro,

                        numero: usuario.numero,

                        complemento: usuario.complemento,

                        bairro: usuario.bairro,

                        cidade: usuario.cidade,

                        uf: usuario.uf

                    }
                    : null
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            mensagem: "Erro ao fazer login com Google"
        });
    }
};


// =====================================================
// PERFIL DO USUÁRIO
// =====================================================

export const perfil = async (req, res) => {

    try {

        const usuarioId = req.usuario?.id;

        if (!usuarioId) {

            return res.status(401).json({
                mensagem: "Usuário não autenticado"
            });
        }

        const [resultado] = await db.query(
            `
            SELECT
                u.id,
                u.nome,
                u.email,
                u.role,
                u.foto,
                e.cep,
                e.logradouro,
                e.numero,
                e.complemento,
                e.bairro,
                e.cidade,
                e.uf
            FROM usuarios u
            LEFT JOIN enderecos e
                ON u.id = e.usuario_id
            WHERE u.id = ?
            `,
            [usuarioId]
        );

        if (resultado.length === 0) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        const usuario = resultado[0];

        return res.status(200).json({

            id: usuario.id,

            nome: usuario.nome,

            email: usuario.email,

            role: usuario.role,

            foto: usuario.foto,

            endereco: usuario.cep
                ? {

                    cep: usuario.cep,

                    logradouro: usuario.logradouro,

                    numero: usuario.numero,

                    complemento: usuario.complemento,

                    bairro: usuario.bairro,

                    cidade: usuario.cidade,

                    uf: usuario.uf

                }
                : null
        });

    } catch (error) {

        console.error(
            "Erro ao buscar perfil:",
            error
        );

        return res.status(500).json({
            mensagem: "Erro ao buscar dados do usuário"
        });
    }
};


// =====================================================
// ATUALIZAR ENDEREÇO
// =====================================================

export const atualizarEndereco = async (req, res) => {

    try {

        const {
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            city,
            uf
        } = req.body;

        const usuarioId = req.usuario?.id;

        if (!usuarioId) {

            return res.status(401).json({
                mensagem: "Usuário não autenticado"
            });
        }

        const enderecoValido = await validarEndereco({

            cep,

            logradouro,

            numero,

            complemento,

            bairro,

            cidade,

            city,

            uf

        });

        if (!enderecoValido) {

            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios do endereço"
            });
        }

        const [enderecoExistente] = await db.query(
            `
            SELECT id
            FROM enderecos
            WHERE usuario_id = ?
            `,
            [usuarioId]
        );

        if (
            enderecoExistente &&
            enderecoExistente.length > 0
        ) {

            await db.query(
                `
                UPDATE enderecos
                SET
                    cep = ?,
                    logradouro = ?,
                    numero = ?,
                    complemento = ?,
                    bairro = ?,
                    cidade = ?,
                    uf = ?
                WHERE usuario_id = ?
                `,
                [

                    enderecoValido.cep,

                    enderecoValido.logradouro,

                    enderecoValido.numero,

                    enderecoValido.complemento,

                    enderecoValido.bairro,

                    enderecoValido.cidade,

                    enderecoValido.uf,

                    usuarioId

                ]
            );

        } else {

            await db.query(
                `
                INSERT INTO enderecos
                (
                    usuario_id,
                    cep,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    uf
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [

                    usuarioId,

                    enderecoValido.cep,

                    enderecoValido.logradouro,

                    enderecoValido.numero,

                    enderecoValido.complemento,

                    enderecoValido.bairro,

                    enderecoValido.cidade,

                    enderecoValido.uf

                ]
            );
        }

        return res.status(200).json({

            mensagem: "Endereço atualizado com sucesso",

            endereco: enderecoValido

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar endereço"
        });
    }
};