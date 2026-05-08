import { useParams } from "react-router";
import './Message.css';

export function Message({ text, sender }) {
  const { username = 'guest' } = useParams();
  const isCurrentUser = sender === username;

  return (
    <div className={isCurrentUser ? "message current-user-message" : "message"}>
      <div className="message-box">
        <div className={isCurrentUser ? "sender current-user" : "sender"}>
          {isCurrentUser ? 'You' : sender}
        </div>
        <div className="text">{text}</div>
      </div>
    </div>
  );
}
