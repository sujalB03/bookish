import React, { useState, useEffect } from "react";
import "../../loader/loader.styles.css";
import BookListingCard from "../../cards/booklisting-card/BookListingCard.js";
import Loading from "../../loader/Loading.js";
import "./booklisting.styles.css";
import { fetchBooks } from "../../../services/bookService.js";

const BookListing = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const subjects = ["History", "Science", "Comedy", "Computers", "Technology"];

  useEffect(() => {
    const getBooks = async () => {
      try {
        setIsLoading(true);

        const randomSubject =
          subjects[Math.floor(Math.random() * subjects.length)];

        // console.log(randomSubject); For debugging purposes only
        const { fetchedBooks } = await fetchBooks({
          category: `${randomSubject}`,
          applyFilter: true,
        });
        setBooks(fetchedBooks);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        // console.log(error);
        setIsLoading(false);
      }
    };
    getBooks();
  }, []);

  if (isLoading) {
    return <Loading message="Fetching awesome books for you..." />;
  }
  if (error) return <p>{error}</p>;

  return (
    <section className="book-listing container">
      <h2 className="book-listing-title">Browse Our Collection</h2>
      <div className="books-container">
        {books.map((book, index) => (
          <BookListingCard key={index} book={book} />
        ))}
      </div>
    </section>
  );
};

export default BookListing;
