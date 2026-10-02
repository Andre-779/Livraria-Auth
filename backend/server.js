import app from './app.js'; //  Certifique-se de incluir a extensão .js


const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando em: http://localhost:3000 :${PORTA}!`);
});
