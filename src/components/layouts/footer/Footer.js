import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import "./footer.styles.css";
import { useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  const form = useRef();
  const date = new Date();
  let currentYear = date.getFullYear();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_69dm49e", // Replace with your Service ID
        "template_r37o7qi", // Replace with your Template ID
        form.current,
        "Wlltl0dNFvJpU9yOn" // Replace with your Public Key
      )
      .then(
        (result) => {
          alert("We've received your query! We'll get back to you shortly!");
          form.current.reset(); //  Clears the form after submission
          navigate("/");
        },
        (error) => {
          alert("Failed to send the query. Please try again.");
          navigate("/");
        }
      );
  };

  return (
    <section className="footer-container">
      <div className="container">
        <h2 className="text-primary">Have a question? We're all ears.</h2>
        <form ref={form} onSubmit={sendEmail} className="footer-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              id="name"
              name="user_name"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="user_email"
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              type="text"
              id="query"
              name="query"
              className="form-input"
              placeholder="Enter your query"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="form-btn">
              Send
            </button>
          </div>
        </form>
        <div className="footer-bottom">
          <p>© {currentYear} Bookish. All Rights Reserved.</p>
        </div>
      </div>
    </section>
  );
}

export default Footer;
