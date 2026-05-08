import { useParams } from 'react-router';
import './Header.css';
import { useContext } from 'react';
import { MessagesContext } from '../context/MessagesContext';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { username = 'guest' } = useParams();
  const { deleteMessages } = useContext(MessagesContext);
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="header">
      <div className="left">
        <span className="chat-title">Chat</span>
        <span className="chat-user">Signed in as {username}</span>
      </div>
      <div className="right">
        <button
          className="header-buttons"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        >
          Logout
        </button>
        <button className="header-buttons danger-button" onClick={deleteMessages}>
          Delete
        </button>
      </div>
    </div>
  );
}
