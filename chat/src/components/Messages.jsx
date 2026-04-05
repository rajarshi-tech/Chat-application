import { Message } from './Message';
import { useContext } from 'react';
import { MessagesContext } from '../context/MessagesContext';
import './Messages.css';

export function Messages() {
  const { messages } = useContext(MessagesContext);
  console.log("Messages component rendered with messages:", messages);
  if (messages.length > 0) {
    return (
      <div className="messages">
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} sender={msg.username} />
        ))}
      </div>
    );
  }

  return <div className="messages">No messages yet.</div>;
}
