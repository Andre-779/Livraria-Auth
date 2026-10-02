import { Navigate } from 'react-router-dom';

function RotaProtegida({ children }) {
    // CORRIGIDO: Alterado de 'token' para '@App:token' para ler o valor gravado
    const token = localStorage.getItem('@App:token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RotaProtegida;
