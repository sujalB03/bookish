import React from "react";
import { Link } from "react-router-dom";
import "./notfound.styles.css";

const NotFound = () => {
  return (
    <div className="not-found-container flex justify-center align-center">
      <h1 className="not-found-heading">404</h1>
      <p className="not-found-message">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="back-home-button">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
