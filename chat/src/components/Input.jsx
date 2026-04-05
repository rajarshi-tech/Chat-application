import { useContext, useState } from 'react';
import { MessagesContext } from '../context/MessagesContext';
import './Input.css';
import { useParams } from 'react-router';

export function Input() {
  const { username = "guest" } = useParams();
  const { updateMessages } = useContext(MessagesContext);
  const [text, setText] = useState('');

  const handleSend = () => {
    if(!text.trim()) {
      return;
    }

    updateMessages({ text: text, username:username });
    setText('');
  };

  return (
    <div className="input-field">
      <input type="text" 
        placeholder="Type a message..." 
        value={text} 
        onChange={(event) => {
          setText(event.target.value);
        }}
        onKeyDown={(event) => {
          if(event.key === "Enter") handleSend();
        }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
