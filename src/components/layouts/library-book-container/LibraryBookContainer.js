import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import Loading from "../../loader/Loading";
import { Link } from "react-router-dom";
import "./LibraryBookContainer.styles.css";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
const LibraryBookContainer = () => {
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useContext(UserContext);

  const fetchLibraryBooks = async () => {
    setIsLoading(true);
    if (user) {
      try {
        const libraryRef = collection(db, "users", user.uid, "library");

        const docSnapshot = await getDocs(libraryRef); // Fetch all documents from 'library' collection
        const libraryBooksData = docSnapshot.docs.map((doc) => doc.data()); //Extract book data

        setLibraryBooks(libraryBooksData);
      } catch (error) {
        console.error("Error fetching library books:", error);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryBooks();
  }, [user]);

  // Function to remove a book from library
  const handleRemoveBook = async (bookId) => {
    if (user) {
      try {
        const bookRef = doc(db, "users", user.uid, "library", bookId);
        await deleteDoc(bookRef);

        const updatedBooks = libraryBooks.filter((book) => book.id !== bookId);
        setLibraryBooks(updatedBooks);
        alert("Book removed from library!");
      } catch (error) {
        console.error("Error removing book:", error);
        alert("Failed to remove the book. Please try again.");
      }
    }
  };

  return (
    <section className="">
      <div className="library-books-container container">
        <h2 className="library-title">Library</h2>
        {isLoading ? (
          <Loading />
        ) : libraryBooks.length === 0 ? (
          <>
            <div className="library-books-container container">
              <p className="empty-library container">No book added yet.</p>
            </div>
          </>
        ) : (
          <div className="library-books-list">
            {libraryBooks.map((book) => (
              <div key={book.id} className="library-book-item">
                <img
                  src={book.volumeInfo.imageLinks.smallThumbnail}
                  alt={book.volumeInfo.title}
                  className="fav-book-image"
                />
                <h3 className="fav-book-title">{book.volumeInfo.title}</h3>
                <p className="book-author">
                  {book.volumeInfo.authors
                    ? book.volumeInfo.authors.join(", ")
                    : ""}
                </p>
                <div className="library-page-btn-container">
                  <Link
                    to={`/book-details/${book.id}`}
                    className="details-link"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemoveBook(book.id)}
                    className="remove-library-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LibraryBookContainer;
