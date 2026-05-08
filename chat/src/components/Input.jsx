import { useContext, useEffect, useRef, useState } from 'react';
import { MessagesContext } from '../context/MessagesContext';
import './Input.css';

export function Input() {
  const { updateMessages } = useContext(MessagesContext);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const setKeyboardOffset = () => {
      const viewport = window.visualViewport;

      if (!viewport) {
        document.documentElement.style.setProperty('--keyboard-offset', '0px');
        return;
      }

      const keyboardOffset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty('--keyboard-offset', `${Math.round(keyboardOffset)}px`);
    };

    setKeyboardOffset();
    window.visualViewport?.addEventListener('resize', setKeyboardOffset);
    window.visualViewport?.addEventListener('scroll', setKeyboardOffset);
    window.addEventListener('resize', setKeyboardOffset);

    return () => {
      document.documentElement.style.setProperty('--keyboard-offset', '0px');
      window.visualViewport?.removeEventListener('resize', setKeyboardOffset);
      window.visualViewport?.removeEventListener('scroll', setKeyboardOffset);
      window.removeEventListener('resize', setKeyboardOffset);
    };
  }, []);

  const handleSend = async (event) => {
    event?.preventDefault();
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
      <form className="input-field" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          aria-label="Message"
          placeholder="Type a message..."
          value={text}
          disabled={isSending}
          onChange={(event) => {
            setText(event.target.value);
          }}
          onFocus={() => {
            window.setTimeout(() => inputRef.current?.scrollIntoView({ block: 'nearest' }), 80);
          }}
        />
        <button type="submit" disabled={isSending || !text.trim()}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
