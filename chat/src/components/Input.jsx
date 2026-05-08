import { useContext, useState } from 'react';
import { MessagesContext } from '../context/MessagesContext';
import './Input.css';

export function Input() {
  const { updateMessages } = useContext(MessagesContext);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedText = text.trim();

    if(!trimmedText || isSending) {
      return;
    }

    setError('');
    setIsSending(true);

    try {
      await updateMessages({ text: trimmedText });
      setText('');
    } catch (err) {
      const detail = err.response?.status === 401
        ? 'Your session expired. Please log in again.'
        : err.response?.data?.detail;
      setError(detail ?? 'Message failed to send. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="input-shell">
      {error ? <div className="input-error">{error}</div> : null}
      <div className="input-field">
        <input type="text"
          placeholder="Type a message..."
          value={text}
          disabled={isSending}
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if(event.key === "Enter") void handleSend();
          }}
        />
        <button onClick={() => { void handleSend(); }} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
