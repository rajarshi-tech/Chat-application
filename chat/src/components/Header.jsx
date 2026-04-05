import { useParams } from 'react-router';
import './Header.css';
import { useContext } from 'react';
import { MessagesContext } from '../context/MessagesContext';
import { useNavigate } from 'react-router';

export function Header() {
  const { username = 'guest' } = useParams();
  const { deleteMessages } = useContext(MessagesContext);
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="left">Chatting as {username}</div>
      <div className="right">
        <button className="header-buttons" onClick={() => navigate('/login')}>
          Logout
        </button>
        <button className="header-buttons" onClick={deleteMessages}>
          Delete
        </button>
      </div>
    </div>
  );
}
