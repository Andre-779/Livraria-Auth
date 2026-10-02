import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';

import PainelAdmin from '../components/PainelAdmin.jsx';
import PainelUsuario from '../components/PainelUsuario.jsx';

import './DashBoard.css';


function DashBoard() {

    const navigate = useNavigate();


    // =====================================================
    // ESTADOS
    // =====================================================

    const [pagina, setPagina] = useState('inicio');

    const [dadosUsuario, setDadosUsuario] = useState(null);

    const [carregandoDados, setCarregandoDados] = useState(false);

    const [erroDados, setErroDados] = useState('');


    // =====================================================
    // DADOS DO LOGIN
    // =====================================================

    const token = localStorage.getItem('@App:token');

    let usuario = null;

    try {

        usuario = JSON.parse(
            localStorage.getItem('usuario')
        );

    } catch (error) {

        console.error(
            'Erro ao ler usuário:',
            error
        );

        usuario = null;
    }


    // =====================================================
    // VERIFICAR LOGIN
    // =====================================================

    useEffect(() => {

        if (!token || !usuario) {

            navigate('/login');

        }

    }, [token, navigate]);


    // =====================================================
    // CARREGAR MEUS DADOS
    // =====================================================

    const carregarMeusDados = async () => {

        try {

            setCarregandoDados(true);

            setErroDados('');

            const resposta = await api.get(
                '/usuarios/perfil'
            );

            console.log(
                'Dados recebidos:',
                resposta.data
            );

            setDadosUsuario(
                resposta.data
            );

            setPagina('dados');


        } catch (error) {

            console.error(
                'Erro ao buscar meus dados:',
                error.response?.data || error
            );

            setErroDados(
                error.response?.data?.mensagem ||
                'Não foi possível carregar seus dados.'
            );

        } finally {

            setCarregandoDados(false);

        }
    };


    // =====================================================
    // INÍCIO
    // =====================================================

    const voltarInicio = () => {

        setPagina('inicio');

        setErroDados('');

    };


    // =====================================================
    // SAIR
    // =====================================================

    const sair = () => {

        localStorage.removeItem('@App:token');

        localStorage.removeItem('usuario');

        navigate('/login');

    };


    // =====================================================
    // SE NÃO ESTIVER LOGADO
    // =====================================================

    if (!usuario) {

        return null;

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="dashboard-sidebar">


                {/* LOGO */}

                <div className="dashboard-logo">

                    📚 Livraria

                </div>


                {/* MENU */}

                <nav className="dashboard-menu">


                    {/* INÍCIO */}

                    <button
                        className={
                            pagina === 'inicio'
                                ? 'menu-ativo'
                                : ''
                        }
                        onClick={voltarInicio}
                    >
                        🏠 Início
                    </button>


                    {/* MEUS DADOS */}

                    <button
                        className={
                            pagina === 'dados'
                                ? 'menu-ativo'
                                : ''
                        }
                        onClick={carregarMeusDados}
                    >
                        👤 Meus dados
                    </button>


                    {/* LIVROS */}

                    <button
                        className={
                            pagina === 'livros'
                                ? 'menu-ativo'
                                : ''
                        }
                        onClick={() => setPagina('livros')}
                    >
                        📚 Livros
                    </button>


                    {/* EMPRÉSTIMOS */}

                    <button
                        className={
                            pagina === 'emprestimos'
                                ? 'menu-ativo'
                                : ''
                        }
                        onClick={() => setPagina('emprestimos')}
                    >
                        📖 Empréstimos
                    </button>


                </nav>


                {/* SAIR */}

                <button
                    className="menu-sair"
                    onClick={sair}
                >
                    🚪 Sair
                </button>


            </aside>


            {/* =================================================
                ÁREA PRINCIPAL
            ================================================= */}

            <main className="dashboard-main">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="dashboard-header">


                    <div>

                        <h1>
                            Olá, {usuario.nome}! 👋
                        </h1>

                        <p>
                            Bem-vindo ao seu painel.
                        </p>

                    </div>


                    {/* INFORMAÇÕES DO USUÁRIO */}

                    <div className="usuario-info">


                        {usuario.foto ? (

                            <img
                                src={usuario.foto}
                                alt="Perfil"
                                referrerPolicy="no-referrer"
                                className="usuario-foto"

                                onError={(e) => {

                                    e.target.style.display =
                                        'none';

                                }}
                            />

                        ) : (

                            <div className="usuario-avatar">

                                {usuario.nome
                                    ?.charAt(0)
                                    .toUpperCase()
                                }

                            </div>

                        )}


                        <div>

                            <strong>
                                {usuario.nome}
                            </strong>

                            <span>
                                {usuario.role}
                            </span>

                        </div>


                    </div>


                </header>


                {/* =================================================
                    CONTEÚDO
                ================================================= */}

                <section className="dashboard-content">


                    {usuario.role === 'admin' ? (

                        <PainelAdmin />

                    ) : (

                        <PainelUsuario

                            pagina={pagina}

                            setPagina={setPagina}

                            dadosUsuario={dadosUsuario}

                            carregandoDados={carregandoDados}

                            erroDados={erroDados}

                            carregarMeusDados={
                                carregarMeusDados
                            }

                        />

                    )}


                </section>


            </main>


        </div>

    );

}


export default DashBoard;