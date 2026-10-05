import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// 1. Importe o provedor oficial do Google OAuth
import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Configure o provedor passando o seu Client ID gerado no Google Console */}
    <GoogleOAuthProvider clientId="97999642203-mms6currpki8mnltndjv748muuogoeik.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
