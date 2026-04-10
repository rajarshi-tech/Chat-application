import { Navigate, Route, Routes } from 'react-router';
import { ChatPage } from './pages/ChatPage';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';
import './App.css'

function App() {
  const { isAuthenticated, user } = useAuth();
  const username = user?.username ?? localStorage.getItem('username');

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated && username ? `/${username}` : "/login"} replace />}
      />
      <Route
        path="/login"
        element={isAuthenticated && username ? <Navigate to={`/${username}`} replace /> : <Login />}
      />
      <Route
        path="/:username"
        element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App
