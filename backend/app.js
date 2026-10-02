import express from 'express';
import "dotenv/config.js"
import cors from 'cors';
import usuarioRotas from './src/middleware/auth.js';






const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ... suas rotas aqui ...

app.use("/usuarios", usuarioRotas);



export default app;