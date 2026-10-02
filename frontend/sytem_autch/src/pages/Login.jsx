import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { GoogleLogin } from '@react-oauth/google'; 

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();

    // Fluxo tradicional de Email/Senha
    async function handleSubmit(ev) {
        ev.preventDefault();
        setSucesso('');
        setErro('');
        
        try {
            const resposta = await api.post('/login', { email, senha });

            // PADRONIZADO: Salvando com '@App:token' para o interceptor funcionar
            localStorage.setItem('@App:token', resposta.data.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));
            
            setSucesso('Login realizado com sucesso! Redirecionando...');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (erroRequisicao) {
            const mensagem = erroRequisicao.response?.data?.mensagem || 'Erro ao realizar login.';
            setErro(mensagem);
        }
    }

    async function handleGoogleSuccess(credentialResponse) {
        setSucesso('');
        setErro('');

        try {
            // CORRIGIDO: Removido o '/usuarios' para bater exatamente com o seu arquivo de rotas do backend
            const resposta = await api.post('/usuarios/google', { 
                credencial: credentialResponse.credential 
            });

            // PADRONIZADO: Salvando com '@App:token' igual ao interceptor do seu api.js
            localStorage.setItem('@App:token', resposta.data.token);
            localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));

            setSucesso('Login com Google realizado! Redirecionando...');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (erroRequisicao) {
            console.error("ERRO DETALHADO DA REQUISIÇÃO:", erroRequisicao.response?.data || erroRequisicao);
            const mensagem = erroRequisicao.response?.data?.mensagem || 'Erro na autenticação com o Google.';
            setErro(mensagem);
        }
    }

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Senha
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </label>
                
                {erro && <p className="erro">{erro}</p>}
                {sucesso && <p className="sucesso">{sucesso}</p>}
                
                <button type="submit">Entrar</button>

                <div style={{ margin: '15px 0', textAlign: 'center' }}>ou</div>

                <div className="google-btn-container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setErro('Falha na autenticação com o Google.')}
                    />
                </div>
            </form>
            <p style={{ marginTop: '20px' }}>
                Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
            </p>
        </div>
    );
}

export default Login;