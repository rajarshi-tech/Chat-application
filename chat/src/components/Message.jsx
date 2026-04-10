import { useParams } from "react-router";
import './Message.css';

export function Message({ text, sender }) {
  const { username = 'guest' } = useParams();

  return (
    <div className={sender === username ? "message current-user-message" : "message"}>
      <div className="message-box">
        <div className="sender">{sender}</div>
        <div className="gap" />
        <div className="text">{text}</div>
        <div className="gap" />
      </div>
    </div>
  );
}
