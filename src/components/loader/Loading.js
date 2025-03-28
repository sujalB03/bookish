import React from "react";
import "./loader.styles.css";
import BookFlipGIF from "./Book_Flip.gif";
const Loading = ({ message = "Loading books..." }) => {
  return (
    <div className="loading-container flex align-center justify-center ">
      <img
        src={BookFlipGIF}
        alt="Loading animation"
        className="loading-gif"
      ></img>

      <p>{message}</p>
    </div>
  );
};

export default Loading;
