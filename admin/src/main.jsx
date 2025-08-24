import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import AgentContextProvider from './context/AgentContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <AgentContextProvider>
        <App />
      </AgentContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
)
