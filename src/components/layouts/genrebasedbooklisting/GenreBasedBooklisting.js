// import React from "react";
// import "./genreBasedBooklisting.styles.css";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// const GenreBasedBooklisting = () => {
//   return (
//     <>
//       <div className="recent-books-container">
//         <h2>Recently Viewed Books</h2>
//         {recentBooks.length === 0 ? (
//           <p>No recently viewed books.</p>
//         ) : (
//           <div className="recent-books-wrapper">
//             {canScroll && (
//               <button
//                 className="scroll-button left"
//                 onClick={() => scroll("left")}
//               >
//                 <FaChevronLeft />
//               </button>
//             )}

//             <div className="recent-books-list" ref={scrollRef}>
//               {recentBooks.map((book) => (
//                 <Link
//                   to={`/book-details/${book.id}`}
//                   key={book.id}
//                   className="recent-book-card"
//                 >
//                   <img
//                     src={book.volumeInfo.imageLinks?.thumbnail}
//                     alt={book.volumeInfo.title}
//                   />
//                   <p title={book.volumeInfo.title}>{book.volumeInfo.title}</p>
//                 </Link>
//               ))}
//             </div>
//             {canScroll && (
//               <button
//                 className="scroll-button right"
//                 onClick={() => scroll("right")}
//               >
//                 <FaChevronRight />
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default GenreBasedBooklisting;

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./genreBasedBooklisting.styles.css";
import { fetchBooks } from "../../../services/bookService";

const GenreBasedBooklisting = ({ category }) => {
  const [books, setBooks] = useState([]);
  const scrollRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getBooks = async () => {
      try {
        const { fetchedBooks } = await fetchBooks({
          category,
          applyFilter: true,
          maxResults: 20,
        });
        setBooks(fetchedBooks);
      } catch (error) {
        console.error(error);
      }
    };
    getBooks();
  }, [category]);

  // Function to check if scrolling is needed
  const checkScrollable = () => {
    if (scrollRef.current) {
      setCanScroll(
        scrollRef.current.scrollWidth > scrollRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    // Run on initial load
    checkScrollable();

    // update the scrolling dynamically
    window.addEventListener("resize", checkScrollable);

    // remove the listener on unmount
    return () => window.removeEventListener("resize", checkScrollable);
  }, [books]); // Re-run when books change

  // Handle scrolling
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleViewAll = (category) => {
    navigate(`/books?category=${category}`);
  };
  return (
    <section className="genre-books-container container">
      <div className="genre-header">
        <h2>
          {category === "Nature" && "Explore Nature"}
          {category === "Business & Economics" && "Mastering Wealth"}
          {category === "Autobiography" && "Beyond the Spotlight"}
        </h2>
        <button
          className="view-all-button"
          onClick={() => handleViewAll(category)}
        >
          View All
        </button>
      </div>
      {books.length === 0 ? (
        <p>No books found for this genre.</p>
      ) : (
        <div className="genre-books-wrapper">
          {canScroll && (
            <button
              className="scroll-button left"
              onClick={() => scroll("left")}
            >
              <FaChevronLeft />
            </button>
          )}

          <div className="genre-books-list" ref={scrollRef}>
            {books.map((book) => (
              <Link
                to={`/book-details/${book.id}`}
                key={book.id}
                className="genre-book-card"
              >
                <img src={book.image} alt={book.title} />
                <h3 className="genre-book-title" title={book.title}>
                  {book.title}
                </h3>
                {book.author && (
                  <p className="genre-book-author">{book.author}</p>
                )}

                <p className="genre-book-price">
                  {book.price === "Free"
                    ? "Free"
                    : `${book?.currency} ${book.price}`}
                </p>
              </Link>
            ))}
          </div>

          {canScroll && (
            <button
              className="scroll-button right"
              onClick={() => scroll("right")}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default GenreBasedBooklisting;
