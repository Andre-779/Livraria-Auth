import { useState } from 'react';

import api from '../api';

import './PainelUsuario.css';


function PainelUsuario({

    pagina,

    setPagina,

    dadosUsuario,

    carregandoDados,

    erroDados,

    carregarMeusDados

}) {


    // =====================================================
    // EDIÇÃO DO ENDEREÇO
    // =====================================================

    const [editando, setEditando] = useState(false);


    const [cep, setCep] = useState('');

    const [logradouro, setLogradouro] = useState('');

    const [bairro, setBairro] = useState('');

    const [cidade, setCidade] = useState('');

    const [uf, setUf] = useState('');

    const [numero, setNumero] = useState('');

    const [complemento, setComplemento] = useState('');


    // =====================================================
    // MENSAGENS
    // =====================================================

    const [erro, setErro] = useState('');

    const [sucesso, setSucesso] = useState('');


    // =====================================================
    // PREPARAR ENDEREÇO PARA EDIÇÃO
    // =====================================================

    const prepararEdicao = () => {

        if (dadosUsuario?.endereco) {

            const endereco =
                dadosUsuario.endereco;


            setCep(
                endereco.cep || ''
            );


            setLogradouro(
                endereco.logradouro || ''
            );


            setBairro(
                endereco.bairro || ''
            );


            setCidade(
                endereco.cidade || ''
            );


            setUf(
                endereco.uf || ''
            );


            setNumero(
                endereco.numero || ''
            );


            setComplemento(
                endereco.complemento || ''
            );

        } else {

            setCep('');
            setLogradouro('');
            setBairro('');
            setCidade('');
            setUf('');
            setNumero('');
            setComplemento('');

        }


        setErro('');

        setSucesso('');

        setEditando(true);

    };


    // =====================================================
    // BUSCAR CEP
    // =====================================================

    const buscarCep = async (valor) => {

        const cepLimpo =
            valor.replace(/\D/g, '');


        setCep(cepLimpo);


        // Só consulta com 8 números

        if (cepLimpo.length !== 8) {

            return;

        }


        try {

            setErro('');


            const resposta = await fetch(
                `https://viacep.com.br/ws/${cepLimpo}/json/`
            );


            const dados =
                await resposta.json();


            if (dados.erro) {

                setErro(
                    'CEP não encontrado.'
                );

                setLogradouro('');
                setBairro('');
                setCidade('');
                setUf('');

                return;

            }


            setLogradouro(
                dados.logradouro || ''
            );


            setBairro(
                dados.bairro || ''
            );


            setCidade(
                dados.localidade || ''
            );


            setUf(
                dados.uf || ''
            );


        } catch (error) {

            console.error(
                'Erro ao consultar CEP:',
                error
            );


            setErro(
                'Erro ao consultar o CEP.'
            );

        }

    };


    // =====================================================
    // SALVAR ENDEREÇO
    // =====================================================

    const salvarEndereco = async (e) => {

        e.preventDefault();


        try {

            setErro('');

            setSucesso('');


            const dadosEndereco = {

                cep,

                logradouro,

                numero,

                complemento,

                bairro,

                cidade,

                uf

            };


            console.log(
                'Enviando endereço:',
                dadosEndereco
            );


            const resposta =
                await api.put(
                    '/usuarios/endereco',
                    dadosEndereco
                );


            console.log(
                'Endereço atualizado:',
                resposta.data
            );


            setSucesso(
                'Endereço atualizado com sucesso!'
            );


            setEditando(false);


            // =================================================
            // BUSCAR DADOS NOVAMENTE
            // =================================================

            await carregarMeusDados();


            // =================================================
            // MANTER NA TELA DE DADOS
            // =================================================

            setPagina('dados');


            setSucesso(
                'Endereço atualizado com sucesso!'
            );


        } catch (err) {

            console.error(
                'Erro ao salvar endereço:',
                err.response?.data || err
            );


            setErro(
                err.response?.data?.mensagem ||
                'Não foi possível atualizar o endereço.'
            );

        }

    };


    // =====================================================
    // CANCELAR EDIÇÃO
    // =====================================================

    const cancelarEdicao = () => {

        setEditando(false);

        setErro('');

        setSucesso('');

    };


    // =====================================================
    // VOLTAR
    // =====================================================

    const voltarInicio = () => {

        setPagina('inicio');

        setEditando(false);

        setErro('');

        setSucesso('');

    };


    // =====================================================
    // TELA MEUS DADOS
    // =====================================================

    if (pagina === 'dados') {

        return (

            <div className="painel-usuario">

                <div className="dados-usuario">


                    {/* =================================================
                        CABEÇALHO
                    ================================================= */}

                    <div className="dados-card-header">

                        <div>

                            <h2>
                                Meus dados
                            </h2>

                            <p>
                                Confira suas informações cadastradas.
                            </p>

                        </div>


                        <button
                            className="botao-voltar"
                            onClick={voltarInicio}
                        >
                            ← Voltar
                        </button>

                    </div>


                    {/* =================================================
                        CARREGANDO
                    ================================================= */}

                    {carregandoDados && (

                        <div className="carregando">

                            <p>
                                Carregando seus dados...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        ERRO DA API
                    ================================================= */}

                    {erroDados && (

                        <div className="mensagem-erro">

                            {erroDados}

                        </div>

                    )}


                    {/* =================================================
                        ERRO LOCAL
                    ================================================= */}

                    {erro && (

                        <div className="mensagem-erro">

                            {erro}

                        </div>

                    )}


                    {/* =================================================
                        SUCESSO
                    ================================================= */}

                    {sucesso && (

                        <div className="mensagem-sucesso">

                            {sucesso}

                        </div>

                    )}


                    {/* =================================================
                        DADOS
                    ================================================= */}

                    {!carregandoDados &&
                        dadosUsuario && (

                            <>


                                {/* =================================================
                                    INFORMAÇÕES PESSOAIS
                                ================================================= */}

                                <div className="dados-card">


                                    <div className="dados-card-titulo">


                                        <div className="dados-icone">
                                            👤
                                        </div>


                                        <div>

                                            <h3>
                                                Informações pessoais
                                            </h3>

                                            <p>
                                                Seus dados de cadastro
                                            </p>

                                        </div>


                                    </div>


                                    <div className="dados-grid">


                                        {/* NOME */}

                                        <div className="dado">

                                            <span>
                                                Nome
                                            </span>

                                            <strong>
                                                {dadosUsuario.nome}
                                            </strong>

                                        </div>


                                        {/* EMAIL */}

                                        <div className="dado">

                                            <span>
                                                E-mail
                                            </span>

                                            <strong>
                                                {dadosUsuario.email}
                                            </strong>

                                        </div>


                                        {/* PERFIL */}

                                        <div className="dado">

                                            <span>
                                                Perfil
                                            </span>

                                            <strong>
                                                {dadosUsuario.role}
                                            </strong>

                                        </div>


                                    </div>


                                </div>


                                {/* =================================================
                                    ENDEREÇO
                                ================================================= */}

                                <div className="dados-card">


                                    <div className="dados-card-titulo">


                                        <div className="dados-icone">
                                            📍
                                        </div>


                                        <div>

                                            <h3>
                                                Endereço
                                            </h3>

                                            <p>
                                                Endereço cadastrado
                                            </p>

                                        </div>


                                    </div>


                                    {/* =================================================
                                        VISUALIZAÇÃO
                                    ================================================= */}

                                    {!editando ? (

                                        dadosUsuario.endereco ? (

                                            <div className="dados-grid">


                                                {/* CEP */}

                                                <div className="dado">

                                                    <span>
                                                        CEP
                                                    </span>

                                                    <strong>
                                                        {dadosUsuario.endereco.cep}
                                                    </strong>

                                                </div>


                                                {/* LOGRADOURO */}

                                                <div className="dado dado-largo">

                                                    <span>
                                                        Logradouro
                                                    </span>

                                                    <strong>
                                                        {dadosUsuario.endereco.logradouro}
                                                    </strong>

                                                </div>


                                                {/* NÚMERO */}

                                                <div className="dado">

                                                    <span>
                                                        Número
                                                    </span>

                                                    <strong>
                                                        {dadosUsuario.endereco.numero}
                                                    </strong>

                                                </div>


                                                {/* COMPLEMENTO */}

                                                <div className="dado">

                                                    <span>
                                                        Complemento
                                                    </span>

                                                    <strong>
                                                        {dadosUsuario.endereco.complemento ||
                                                            'Não informado'
                                                        }
                                                    </strong>

                                                </div>


                                                {/* BAIRRO */}

                                                <div className="dado">

                                                    <span>
                                                        Bairro
                                                    </span>

                                                    <strong>
                                                        {dadosUsuario.endereco.bairro}
                                                    </strong>

                                                </div>


                                                {/* CIDADE */}

                                                <div className="dado">

                                                    <span>
                                                        Cidade
                                                    </span>

                                                    <strong>
                                                        {dadosUsuario.endereco.cidade}
                                                    </strong>

                                                </div>


                                                {/* UF */}

                                                <div className="dado">

                                                    <span>
                                                        UF
                                                    </span>

                                                    <strong>
                                                        {dadosUsuario.endereco.uf}
                                                    </strong>

                                                </div>


                                            </div>

                                        ) : (

                                            <div className="sem-endereco">

                                                <p>
                                                    Nenhum endereço cadastrado.
                                                </p>

                                            </div>

                                        )

                                    ) : (


                                        /* =================================================
                                            FORMULÁRIO
                                        ================================================= */

                                        <form
                                            className="formulario-endereco"
                                            onSubmit={salvarEndereco}
                                        >


                                            {/* CEP */}

                                            <div className="campo">

                                                <label>
                                                    CEP
                                                </label>

                                                <input
                                                    type="text"
                                                    value={cep}
                                                    onChange={(e) =>
                                                        buscarCep(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="00000000"
                                                    maxLength="8"
                                                    required
                                                />

                                            </div>


                                            {/* LOGRADOURO */}

                                            <div className="campo campo-largo">

                                                <label>
                                                    Logradouro
                                                </label>

                                                <input
                                                    type="text"
                                                    value={logradouro}
                                                    onChange={(e) =>
                                                        setLogradouro(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>


                                            {/* NÚMERO */}

                                            <div className="campo">

                                                <label>
                                                    Número
                                                </label>

                                                <input
                                                    type="text"
                                                    value={numero}
                                                    onChange={(e) =>
                                                        setNumero(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>


                                            {/* COMPLEMENTO */}

                                            <div className="campo">

                                                <label>
                                                    Complemento
                                                </label>

                                                <input
                                                    type="text"
                                                    value={complemento}
                                                    onChange={(e) =>
                                                        setComplemento(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Apartamento, casa..."
                                                />

                                            </div>


                                            {/* BAIRRO */}

                                            <div className="campo">

                                                <label>
                                                    Bairro
                                                </label>

                                                <input
                                                    type="text"
                                                    value={bairro}
                                                    onChange={(e) =>
                                                        setBairro(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>


                                            {/* CIDADE */}

                                            <div className="campo">

                                                <label>
                                                    Cidade
                                                </label>

                                                <input
                                                    type="text"
                                                    value={cidade}
                                                    onChange={(e) =>
                                                        setCidade(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>


                                            {/* UF */}

                                            <div className="campo">

                                                <label>
                                                    UF
                                                </label>

                                                <input
                                                    type="text"
                                                    value={uf}
                                                    onChange={(e) =>
                                                        setUf(
                                                            e.target.value
                                                                .toUpperCase()
                                                                .slice(0, 2)
                                                        )
                                                    }
                                                    maxLength="2"
                                                    required
                                                />

                                            </div>


                                            {/* BOTÕES */}

                                            <div className="botoes-endereco">


                                                <button
                                                    type="submit"
                                                    className="botao-salvar"
                                                >
                                                    💾 Salvar endereço
                                                </button>


                                                <button
                                                    type="button"
                                                    className="botao-cancelar"
                                                    onClick={cancelarEdicao}
                                                >
                                                    Cancelar
                                                </button>


                                            </div>


                                        </form>

                                    )}


                                    {/* =================================================
                                        EDITAR
                                    ================================================= */}

                                    {!editando && (

                                        <button
                                            className="botao-editar-dados"
                                            onClick={prepararEdicao}
                                        >
                                            ✏️ Editar endereço
                                        </button>

                                    )}


                                </div>


                            </>

                        )}


                </div>

            </div>

        );

    }


    // =====================================================
    // PÁGINA PRINCIPAL
    // =====================================================

    if (pagina === 'inicio') {

        return (

            <div className="painel-usuario">


                {/* =================================================
                    CABEÇALHO
                ================================================= */}

                <div className="painel-header">

                    <div>

                        <h2>
                            Visão geral
                        </h2>

                        <p>
                            Acompanhe sua atividade na livraria.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    CARDS DE RESUMO
                ================================================= */}

                <div className="cards-resumo">


                    {/* EMPRÉSTIMOS */}

                    <div className="card-resumo">

                        <div className="card-resumo-icone">
                            📚
                        </div>

                        <div>

                            <span>
                                Empréstimos
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>

                    </div>


                    {/* DEVOLVIDOS */}

                    <div className="card-resumo">

                        <div className="card-resumo-icone">
                            📖
                        </div>

                        <div>

                            <span>
                                Livros devolvidos
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>

                    </div>


                    {/* PENDENTES */}

                    <div className="card-resumo">

                        <div className="card-resumo-icone">
                            ⏳
                        </div>

                        <div>

                            <span>
                                Pendentes
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>

                    </div>


                </div>


                {/* =================================================
                    ACESSO RÁPIDO
                ================================================= */}

                <div className="secao-dashboard">

                    <h3>
                        Acesso rápido
                    </h3>


                    <div className="acoes-grid">


                        {/* MEUS DADOS */}

                        <button
                            className="acao-card"
                            onClick={carregarMeusDados}
                        >

                            <div className="acao-icone">
                                👤
                            </div>

                            <div>

                                <strong>
                                    Meus dados
                                </strong>

                                <span>
                                    Ver minhas informações
                                </span>

                            </div>

                        </button>


                        {/* EMPRÉSTIMOS */}

                        <button
                            className="acao-card"
                            onClick={() =>
                                setPagina('emprestimos')
                            }
                        >

                            <div className="acao-icone">
                                📚
                            </div>

                            <div>

                                <strong>
                                    Meus empréstimos
                                </strong>

                                <span>
                                    Ver livros emprestados
                                </span>

                            </div>

                        </button>


                        {/* LIVROS */}

                        <button
                            className="acao-card"
                            onClick={() =>
                                setPagina('livros')
                            }
                        >

                            <div className="acao-icone">
                                🔎
                            </div>

                            <div>

                                <strong>
                                    Explorar livros
                                </strong>

                                <span>
                                    Encontrar novos livros
                                </span>

                            </div>

                        </button>


                    </div>

                </div>


                {/* =================================================
                    EMPRÉSTIMOS RECENTES
                ================================================= */}

                <div className="secao-dashboard">


                    <div className="secao-titulo">

                        <div>

                            <h3>
                                Empréstimos recentes
                            </h3>

                            <p>
                                Seus últimos empréstimos.
                            </p>

                        </div>

                    </div>


                    <div className="sem-registros">

                        <div className="sem-registros-icone">
                            📚
                        </div>

                        <h4>
                            Nenhum empréstimo ainda
                        </h4>

                        <p>
                            Quando você fizer um empréstimo,
                            ele aparecerá aqui.
                        </p>

                    </div>


                </div>


            </div>

        );

    }


    // =====================================================
    // PÁGINA LIVROS
    // =====================================================

    if (pagina === 'livros') {

        return (

            <div className="painel-usuario">

                <div className="dados-usuario">

                    <div className="dados-card-header">

                        <div>

                            <h2>
                                📚 Livros
                            </h2>

                            <p>
                                Explore os livros disponíveis
                                na livraria.
                            </p>

                        </div>


                        <button
                            className="botao-voltar"
                            onClick={voltarInicio}
                        >
                            ← Voltar
                        </button>

                    </div>


                    <div className="sem-registros">

                        <div className="sem-registros-icone">
                            📚
                        </div>

                        <h4>
                            Catálogo de livros
                        </h4>

                        <p>
                            A área de livros será disponibilizada
                            aqui.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // PÁGINA EMPRÉSTIMOS
    // =====================================================

    if (pagina === 'emprestimos') {

        return (

            <div className="painel-usuario">

                <div className="dados-usuario">

                    <div className="dados-card-header">

                        <div>

                            <h2>
                                📖 Meus empréstimos
                            </h2>

                            <p>
                                Consulte seus livros emprestados.
                            </p>

                        </div>


                        <button
                            className="botao-voltar"
                            onClick={voltarInicio}
                        >
                            ← Voltar
                        </button>

                    </div>


                    <div className="sem-registros">

                        <div className="sem-registros-icone">
                            📖
                        </div>

                        <h4>
                            Nenhum empréstimo
                        </h4>

                        <p>
                            Quando você realizar um empréstimo,
                            ele aparecerá aqui.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // FALLBACK
    // =====================================================

    return null;

}


export default PainelUsuario;