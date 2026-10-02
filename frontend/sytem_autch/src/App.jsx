import {Routes, Route, Navigate} from 'react-router-dom';
import Cadastro from './pages/Cadastro.jsx';
import Login from './pages/Login.jsx';
import DashBoard from './pages/DashBoard.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';

function App(){
  return(
    <Routes>
      <Route path='/' element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/cadastrar' element={<Cadastro />} />
      <Route path='/dashboard' 
      element={
      <RotaProtegida>
      <DashBoard />
      </RotaProtegida>} />
    </Routes>
  )
}

export default App;