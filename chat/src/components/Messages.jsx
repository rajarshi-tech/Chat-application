import { Message } from './Message';
import { useContext, useEffect, useRef } from 'react';
import { MessagesContext } from '../context/MessagesContext';
import './Messages.css';

export function Messages() {
  const { messages } = useContext(MessagesContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  return (
    <main className="messages" aria-live="polite">
      {messages.length > 0 ? (
        messages.map((msg) => (
          <Message key={msg.id} text={msg.text} sender={msg.username} />
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-title">No messages yet</div>
          <div className="empty-copy">Start the conversation below.</div>
        </div>
      )}
      <div ref={bottomRef} />
    </main>
  );
}
