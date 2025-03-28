import React, { useState } from "react";
import "../auth.styles.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      alert(`You are logged in successfully.`);
      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error);
      const errorCode = error.code;
      let errorMessage = error.message;

      // Custom error messages
      if (errorCode === "auth/invalid-credential") {
        errorMessage = "Invalid credentials";
      } else if (
        errorCode === "auth/too-many-requests" ||
        "auth/too-many-request"
      ) {
        errorMessage = "Please try again later.";
      }

      setError(errorMessage);
    }
  };

  const handleNotNow = () => {
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login to Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p className="auth-footer-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <button onClick={handleNotNow} className="not-now-button">
          Not Now
        </button>
      </div>
    </div>
  );
};

export default Login;
