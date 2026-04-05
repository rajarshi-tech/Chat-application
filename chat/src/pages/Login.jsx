import { useState } from "react";
import { useNavigate } from "react-router";
import './Login.css';

export function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  return(
    <div className="login">
      <input 
        className="login-input"
        type="text" 
        placeholder="Enter your username" 
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <div className="buttons">
        <button className="login-button" onClick={() => {
          navigate(`/${username}`);
        }}>Login</button>
        <button className="login-button" onClick={() => {
          navigate("/guest");
        }}>Login as Guest</button>
      </div>
    </div>
  );
}