import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Bootstrap CSS - estilos globales de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter envuelve toda la app para que React Router funcione */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
