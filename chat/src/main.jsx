import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MessagesProvider } from './context/MessagesContext.jsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MessagesProvider>
        <App />
      </MessagesProvider>
    </BrowserRouter>
  </StrictMode>,
)
