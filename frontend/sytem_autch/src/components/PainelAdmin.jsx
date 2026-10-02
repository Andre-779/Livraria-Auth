function PainelAdmin() {
    return (
       <div className="painel-admin">
           <h2>Painel do administrador</h2>
           <p>Você está vendo esta tela pois o seu usuario é um administrador.</p>
           <ul>
            <li>Gerenciar usuários</li>
            <li>Relatorio do sistema</li>
            <li>Ver estatísticas</li>
           </ul>
       </div>
    );
}

export default PainelAdmin;
