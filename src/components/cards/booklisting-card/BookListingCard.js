import React from "react";
import "../booklisting-card/booklistingCard.styles.css";
import { Link } from "react-router-dom";

const BookListingCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-price">
          {book.availabilty !== "free"
            ? !book.currency
              ? `${book.price}`
              : `${book.currency + " " + book.price}`
            : "Free"}
        </p>
      </div>
      <Link className="details-button" to={`/book-details/${book.id}`}>
        View Details
      </Link>
    </div>
  );
};

export default BookListingCard;
