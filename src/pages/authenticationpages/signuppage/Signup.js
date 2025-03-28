import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../auth.styles.css";
import { auth, db } from "../../../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create a new user using email and password in Firestore
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      //Setting/Update the username to display name
      await updateProfile(user, {
        displayName: username,
      });

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        name: name,
        email: email,
        createdAt: new Date(),
      });

      alert(`Welcome Aboard. You are Signed Up Successfully`);
      // console.log(user);

      // Redirect to login page after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
      const errorCode = error.code;
      let errorMessage = error.message;

      // Custom error messages
      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (errorCode === "auth/weak-password") {
        errorMessage = "Password must be at least 6 characters.";
      } else if (errorCode === "auth/password-does-not-meet-requirements") {
        errorMessage =
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autocomplete="off"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="name"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autocomplete="new-password"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autocomplete="new-password"
            />
          </div>
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
