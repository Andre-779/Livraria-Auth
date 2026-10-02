import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

function Cadastro() { 
    const [nome, setNome] = useState('');     
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(ev) {
        ev.preventDefault();
        setSucesso('');
        setErro('');

        try {
            await api.post('/cadastrar', { nome, email, senha });
            setSucesso('Usuário cadastrado com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (erroRequisicao) {
            const mensagem = erroRequisicao.response?.data?.erro || 'Erro ao cadastrar usuário.';
            setErro(mensagem);
        }
    } 
    return (    
        <div className="container">      
            <h1>Cadastro</h1>      
            <form onSubmit={handleSubmit}>        
                <label>          
                    Nome          
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />        
                </label>         
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
                <button type="submit">Cadastrar</button>      
            </form>       
            <p>        
                Já tem conta? <Link to="/login">Fazer login</Link>      
            </p>    
        </div>  
    );
}

export default Cadastro;
