// 🚫 Desactivar logs en producción
if (import.meta.env.MODE === "production") {
  console.log = () => { };
  console.warn = () => { };
  console.error = () => { };
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)
