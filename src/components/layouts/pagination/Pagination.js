import React from "react";
import "./pagination.styles.css";

const Pagination = ({
  currentPage,
  totalBooks,
  booksPerPage,
  handlePageChange,
}) => {
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  return (
    <>
      <div className="pagination flex justify-center align-center">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};
export default Pagination;
