import express from "express"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ATUALIZADO: Incluída a função atualizarEndereco vinda do seu controller
import {
    cadastrarUsuario,
    login,
    loginGoogle,
    perfil,
    atualizarEndereco
} from "../controllers/usuariosControllers.js"; 

dotenv.config();

const router = express.Router(); 

function verificarTokenInterno(req, res, next){
    const authHeader = req.headers['authorization']; 

    if(!authHeader){
        return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, process.env.jwt_secret, (err, usuarioDecodificado) =>{
        if(err){
            return res.status(403).json({ mensagem: "Token inválido ou expirado" });
        }

        req.usuario = usuarioDecodificado; 
        next();
    });
}

// Definição das URLs (Endpoints) do seu sistema
router.post("/cadastrar", cadastrarUsuario); 
router.post("/login", login);               
router.post("/google", loginGoogle); // <-- Mantida sua rota original (/usuarios/google)

// ADICIONADO: Nova rota PUT de endereço protegida pelo token (Item 2 do roteiro)
router.put("/endereco", verificarTokenInterno, atualizarEndereco); 

router.get("/perfil", verificarTokenInterno, perfil); 

export default router;
