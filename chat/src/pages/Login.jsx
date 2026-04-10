import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, isAuthenticated, user } = useAuth();

  const redirectUsername = user?.username ?? localStorage.getItem("username");

  if (isAuthenticated && redirectUsername) {
    return <Navigate to={`/${redirectUsername}`} replace />;
  }

  const submitAuth = async (mode) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Enter both a username and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await signup(trimmedUsername, trimmedPassword);
      } else {
        await login(trimmedUsername, trimmedPassword);
      }

      navigate(`/${trimmedUsername}`, { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail ?? `Unable to ${mode}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <form
        className="login"
        onSubmit={(event) => {
          event.preventDefault();
          void submitAuth("login");
        }}
      >
        <div className="login-copy">
          <h1>Welcome back</h1>
          <p>Log in to chat, or create an account with the same form.</p>
        </div>

        <input
          className="login-input"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? <p className="login-error">{error}</p> : null}

        <div className="buttons">
          <button className="login-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Working..." : "Login"}
          </button>
          <button
            className="login-button login-button-secondary"
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              void submitAuth("signup");
            }}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
