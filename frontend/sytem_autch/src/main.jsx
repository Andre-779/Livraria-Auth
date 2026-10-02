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
    <GoogleOAuthProvider clientId="293805432707-ueamfsj29mp4bkl566057qapku5fn4g5.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
