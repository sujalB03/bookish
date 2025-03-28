import React, { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import "./searchinput.styles.css";
import { useLocation, useNavigate } from "react-router-dom";

function SearchInput({ onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [sortOption, setSortOption] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null); // Tracks which filter is selected
  const isBooksPage = location.pathname === "/books";

  const handleSearch = () => {
    if (input.trim() !== "") {
      const searchParams = new URLSearchParams({
        [searchType]: input,
        sort: sortOption,
      });
      navigate(`/books?${searchParams.toString()}`); // Updates the URL properly

      onSearch({
        query: input,
        type: searchType,
        sort: sortOption,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    handleSearch();
  };

  return (
    <div className="search-container flex align-center">
      {/* Search Bar */}
      <div className="search-bar flex align-center">
        <input
          type="text"
          placeholder={`Search by ${searchType}...`}
          className="search-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <FaSearch className="search-icon text-primary" onClick={handleSearch} />
      </div>

      {/* Filter Row (Desktop View) */}
      <div className="filter-row">
        <div className="filter-group flex align-center">
          <label>Find By</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="filter-select"
          >
            <option value="title">Title</option>

            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
          </select>
        </div>

        <div className="filter-group flex align-center">
          <label>Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="filter-select"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Mobile Sticky Button */}
      {isBooksPage && (
        <div className="sticky-buttons">
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(true)}
          >
            <FaFilter /> Filters
          </button>
        </div>
      )}

      {/* Filter Modal (Slides Up from Bottom) */}
      <div className={`mobile-filter-overlay ${showFilters ? "active" : ""}`}>
        {/* Header */}
        <div className="mobile-filter-header">
          <span className="filter-title">Filters</span>
          <FaTimes
            className="close-icon"
            onClick={() => setShowFilters(false)}
          />
        </div>

        {/* Main Filter Content */}
        <div className="mobile-filter">
          {/* Left Side - Filter Criteria */}
          <div className="filter-left">
            <button
              className={selectedFilter === "Search By" ? "active" : ""}
              onClick={() => setSelectedFilter("Search By")}
            >
              Search By
            </button>
            <button
              className={selectedFilter === "Sort By" ? "active" : ""}
              onClick={() => setSelectedFilter("Sort By")}
            >
              Sort By
            </button>
          </div>

          {/* Right Side - Filter Sub-options */}
          <div className="filter-right">
            {selectedFilter === "Search By" && (
              <>
                <button
                  className={searchType === "title" ? "selected-option" : ""}
                  onClick={() => setSearchType("title")}
                >
                  Title
                </button>

                <button
                  className={searchType === "author" ? "selected-option" : ""}
                  onClick={() => setSearchType("author")}
                >
                  Author
                </button>
                <button
                  className={searchType === "isbn" ? "selected-option" : ""}
                  onClick={() => setSearchType("isbn")}
                >
                  ISBN
                </button>
              </>
            )}

            {selectedFilter === "Sort By" && (
              <>
                <button
                  className={
                    sortOption === "relevance" ? "selected-option" : ""
                  }
                  onClick={() => setSortOption("relevance")}
                >
                  Relevance
                </button>
                <button
                  className={sortOption === "newest" ? "selected-option" : ""}
                  onClick={() => setSortOption("newest")}
                >
                  Newest
                </button>
              </>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <div className="filter-actions">
          <button className="apply-btn" onClick={handleApplyFilters}>
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchInput;
