import React from "react";
import "./showcase.styles.css";
import Navbar from "../navbar/Navbar";
import SearchInput from "../../forms/SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Showcase = () => {
  const handleSearch = () => {
    console.log(`Search function is working`);
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight, // Scrolls to the next section
      behavior: "smooth", // Smooth scroll
    });
  };

  return (
    <section className="showcase-container">
      <Navbar />

      <div className="showcase-overlay"></div>
      <div className="showcase-content">
        <h1 className="showcase-heading">
          Discover Your <span className="text-primary">Next Great</span> Read
        </h1>
        <p className="showcase-paragraph">
          Find your new favorite from thousands of bestsellers, classics, and
          indie authors.
        </p>

        {/* Pass the handleSearch function to SearchInput */}
        <SearchInput onSearch={handleSearch} />

        {/* Scroll Down Button */}
        <div className="scroll-down-btn" onClick={handleScrollDown}>
          <FontAwesomeIcon icon={faChevronDown} className="scroll-icon" />
        </div>
      </div>
    </section>
  );
};

export default Showcase;
