import express from "express";
import verificarToken from "../middleware/auth.js";

import {
    cadastrarUsuario,
    login,
    perfil,
    loginGoogle,
    atualizarEndereco
} from "../controllers/usuariosControllers.js";

const router = express.Router();

router.post('/cadastrar', cadastrarUsuario);
router.post('/login', login);
router.post('/login/google', loginGoogle); // <-- Padronizado com aspas simples ''
router.put('/endereco', verificarToken, atualizarEndereco); 
router.get('/perfil', verificarToken, perfil);

export default router;
