import { Navigate, Route, Routes } from 'react-router';
import { ChatPage } from './pages/ChatPage';
import { Login } from './pages/Login';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/:username" element={<ChatPage />} />
    </Routes>
  )
}

export default App
