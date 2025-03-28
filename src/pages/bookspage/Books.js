import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/layouts/navbar/Navbar";
import SearchInput from "../../components/forms/SearchInput";
import BookListingCard from "../../components/cards/booklisting-card/BookListingCard";
import "./books.styles.css";
import Loading from "../../components/loader/Loading";
import Pagination from "../../components/layouts/pagination/Pagination";
import { fetchBooks } from "../../services/bookService";
import Footer from "../../components/layouts/footer/Footer";

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const titleQuery = searchParams.get("title") || "";
  const categoryQuery = searchParams.get("category") || "";
  const authorQuery = searchParams.get("author") || "";
  const isbnQuery = searchParams.get("isbn") || "";
  const sortOptionQuery = searchParams.get("sort") || "";

  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("current-page")
      ? parseInt(localStorage.getItem("current-page"))
      : 1
  );

  const booksPerPage = 12;

  useEffect(() => {
    const getBooks = async () => {
      const startIndex = (currentPage - 1) * booksPerPage;
      setIsLoading(true);

      try {
        let fetchedBooks = [];
        let totalItems = 0;

        if (
          !titleQuery.trim() &&
          !categoryQuery.trim() &&
          !authorQuery.trim() &&
          !isbnQuery.trim() &&
          !sortOptionQuery.trim()
        ) {
          // Fetching books (harry potter's random books)
          const { totalItems: randomTotal, fetchedBooks: randomBooks } =
            await fetchBooks({
              applyFilter: true,
              startIndex,
              maxResults: booksPerPage,
            });
          fetchedBooks = randomBooks;
          totalItems = randomTotal;
        } else {
          // Fetch books by title or genre
          const { totalItems: searchTotal, fetchedBooks: searchBooks } =
            await fetchBooks({
              title: titleQuery,
              category: categoryQuery,
              author: authorQuery,
              isbn: isbnQuery,
              startIndex,
              orderBy: sortOptionQuery || `relevance`,
              maxResults: booksPerPage,
            });
          fetchedBooks = searchBooks;
          totalItems = searchTotal;
        }

        setBooks(fetchedBooks);
        setTotalBooks(totalItems);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getBooks();
  }, [
    currentPage,
    titleQuery,
    categoryQuery,
    authorQuery,
    isbnQuery,
    sortOptionQuery,
  ]);

  const handleSearch = (searchParams) => {
    console.log("Search Triggered: ", searchParams);
  };

  // Function to handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem("current-page", page);
  };

  return (
    <>
      <Navbar darkTheme={true} />
      <div className="search-input-container">
        <div className="search-header">
          <h2>Your Next Favorite Book Awaits: Start Searching!</h2>
        </div>
        <SearchInput onSearch={handleSearch} />
      </div>
      <section className="container book-listing">
        <div className="books-container">
          {isLoading ? (
            <Loading message="Gathering the best books just for you..." />
          ) : (
            books.map((book, index) => {
              return <BookListingCard key={index} book={book} />;
            })
          )}
        </div>
      </section>
      {/* Pagination */}
      {totalBooks > booksPerPage && (
        <Pagination
          currentPage={currentPage}
          totalBooks={totalBooks}
          booksPerPage={booksPerPage}
          handlePageChange={handlePageChange}
        />
      )}
      <Footer />
    </>
  );
}

export default Books;
