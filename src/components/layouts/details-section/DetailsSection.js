import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import googlePlayIcon from "../../../assets/google-play_icon.png";
import flipkartIcon from "../../../assets/flipkart_icon.png";
import amazonIcon from "../../../assets/amazon_icon.png";
import libraryIcon from "../../../assets/library_icon.png";
import "./detailssection.styles.css";

import { fetchBookById } from "../../../services/bookServiceById";
import Loading from "../../loader/Loading";
import { UserContext } from "../../../App";

import {
  getDoc,
  doc,
  collection,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
const DetailsSection = () => {
  const [book, setBook] = useState(null); //hold the book data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useContext(UserContext);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  // console.log(id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    window.scrollTo(0, 0);

    const getBook = async () => {
      try {
        setIsLoading(true);
        const bookData = await fetchBookById({ id });
        setBook(bookData);
        // console.log(bookData);
        setIsLoading(false);

        if (user?.uid) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists) {
            let recentlyViewed = userSnap.data().recentlyViewed || [];

            //Remove the book if already exists
            recentlyViewed = recentlyViewed.filter((b) => b.id !== bookData.id);

            // Add new book at the start
            recentlyViewed.unshift(bookData);

            await updateDoc(userRef, {
              recentlyViewed,
            });
          }
        }
      } catch (error) {
        setError("Failed to fetch books: " + error.message);
        setIsLoading(false);
      }
    };

    getBook();

    // For Divider on smaller screens
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id, user]);

  useEffect(() => {
    const isBookExists = async () => {
      try {
        const bookDocRef = doc(db, "users", user.uid, "library", id);
        const docSnapshot = await getDoc(bookDocRef);
        if (!docSnapshot.exists()) {
          setIsAdded(false);
        } else {
          setIsAdded(true);
        }
      } catch (error) {
        console.error("Error checking book existence: ", error);
      }
    };
    isBookExists();
  }, [book]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return <Loading message="Fetching your book details..." />;
  }

  if (error) return <p>{error}</p>;

  if (!book) {
    return <Loading message="Fetching your book details..." />;
  }
  const {
    volumeInfo: {
      title,
      subtitle,
      authors,
      publishedDate,
      description,
      industryIdentifiers,
      categories,
      pageCount,
      language,
      publisher,
      imageLinks,
      previewLink,
    },
    saleInfo: { buyLink },
  } = book;

  // Handling Add to Library Button
  const handleAddToLibrary = async () => {
    if (user) {
      const libraryRef = collection(db, "users", user.uid, "library");
      // Create a reference to the document using bookId (or a unique identifier)
      const bookDocRef = doc(libraryRef, book.id);

      const docSnapshot = await getDoc(bookDocRef);
      if (!docSnapshot.exists()) {
        // Add the book to the library
        alert(`${title} added to your library!`);
        await setDoc(bookDocRef, {
          addedAt: serverTimestamp(),
          addedBy: user.uid,
          ...book,
        });
        setIsAdded(true);
      } else {
        alert(`${title} is already in your library!`);
        setIsAdded(true);
      }
    } else {
      alert("Please Login to Add Book to Library");
      navigate("/login");
    }
  };

  return (
    <>
      <section className="detailSection-container">
        <div className="container">
          <div className="detailSection_book-detail-container">
            <p className="detailSection_book-category">
              Genre -{" "}
              <span>{categories ? categories.join(", ") : "Unknown"}</span>
            </p>
            <div className="detailSection_book-details flex justify-between">
              <div className="detailSection_book-info flex">
                <div className="detailSection_title-container">
                  <h4 className="detailSection_book-title">{title}</h4>
                  <p className="detailSection_book-subtitle">
                    {subtitle ? subtitle : ""}
                  </p>
                </div>

                <div className="detailSection_book-author" href="">
                  <span>By </span>{" "}
                  {authors?.length > 0 ? (
                    authors.map((author, index) => (
                      <span key={index}>
                        <a
                          className="author-link"
                          href={`https://www.google.co.in/search?q=inauthor:%22${author}%22&udm=36`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {author}
                        </a>
                        {index < authors.length - 1 && ", "}{" "}
                        {/* Add a comma between authors, but not after the last one */}
                      </span>
                    ))
                  ) : (
                    <span>Unknown</span>
                  )}
                </div>

                <p className="detailSection_book-published-year"> 2022</p>
                <div className="button-div-container flex">
                  <button
                    disabled={isAdded}
                    className={
                      "add-to-favorite-btn flex align-center" +
                      (isAdded && "already-added-color")
                    }
                    onClick={handleAddToLibrary}
                  >
                    <img src={libraryIcon} alt="Library Icon" />

                    {isAdded ? "Added to Library" : "Add to Library"}
                  </button>
                  <a
                    href={previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="preview-btn flex align-center">
                      <FontAwesomeIcon icon={faBookOpen} />
                      Preview
                    </button>
                  </a>
                </div>
              </div>

              <div className="detailSection_book-cover-container">
               <img
                  src={
                    book.volumeInfo?.imageLinks?.thumbnail ||
                    "https://placehold.co/150?text=Image%20Not%20Available"
                  }
                  alt="Book Cover"
                  className="detailSection_book-cover"
                />
              </div>
            </div>
          </div>

          <div className="overview-section">
            <h4 className="section-heading">Overview</h4>
            <div className="overview-list-container flex">
              <ul className="detailSection_list first-list">
                <li>
                  <p>ISBN:</p>
                  <span title="ISBN_13">
                    {industryIdentifiers
                      ? industryIdentifiers[1].identifier
                      : "Not available"}
                  </span>

                  <span title="ISBN_10">
                    {industryIdentifiers
                      ? ", " + industryIdentifiers[0].identifier
                      : " "}
                  </span>
                </li>
                <li>
                  <p>Page count:</p>
                  <span>{pageCount}</span>
                </li>
                <li>
                  <p>Language:</p>
                  <span>{language}</span>
                </li>
                <li>
                  <p>Author:</p>
                  <span>
                    {(authors?.length && authors.join(", ")) || "Not Available"}
                  </span>
                </li>
              </ul>
              <ul className="detailSection_list second-list">
                {/* <li>
                  <p>Format:</p>
                  <span>{}</span>
                </li> */}

                <li>
                  <p>Published:</p>
                  <span>{publishedDate ? publishedDate : "Not Available"}</span>
                </li>
                <li>
                  <p>Publisher:</p>
                  <span>{publisher ? publisher : "Not Available"}</span>
                </li>
              </ul>
            </div>

            <div className="divider"></div>

            <p className="book-description">
              {isMobile && !isExpanded
                ? `${description.substring(0, 400)}...`
                : description}
            </p>
            {isMobile && <div className="divider"></div>}
            {isMobile && (
              <button
                className="read-more-btn flex justify-between"
                onClick={handleToggle}
              >
                <span>
                  {isExpanded ? (
                    <FontAwesomeIcon icon={faAngleUp} />
                  ) : (
                    <FontAwesomeIcon icon={faAngleDown} />
                  )}
                </span>
                {isExpanded ? "Read Less" : "Read More"}{" "}
              </button>
            )}
          </div>

          <div className="buy-book-section">
            <h4 className="section-heading">Get It Now</h4>
            <div className="buy-book-list-container">
              <ul className="detailSection_list">
                <li>
                  <a
                    href={buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-book-link flex justify-between"
                  >
                    <div className="buy-book-icon-container flex align-center">
                      <div>
                        <img
                          src={googlePlayIcon}
                          alt="Google Play Store"
                          className="buy-book-icon"
                        />
                      </div>
                     <span className="buy-span">Google Play</span>
                    </div>
                    <div
                      className={
                        (!buyLink && "not-available") + " buy-book-button flex"
                      }
                    >
                      <span
                        className={"buy-span " + (!buyLink && "not-available")}
                      >
                        {buyLink ? "Buy eBook" : "Not Available"}
                      </span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.flipkart.com/search?q=${title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-book-link flex justify-between"
                  >
                    <div className="buy-book-icon-container flex align-center">
                      <div>
                        <img
                          src={flipkartIcon}
                          alt="Flipkart"
                          className="buy-book-icon"
                        />
                      </div>
                     <span className="buy-span">Flipkart</span>
                    </div>
                    <div className="buy-book-button">
                      <span className="buy-span">Buy on Flipkart</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.amazon.in/s?k=${title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-book-link flex justify-between"
                  >
                    <div className="buy-book-icon-container flex align-center">
                      <div>
                        <img
                          src={amazonIcon}
                          alt="Amazon"
                          className="buy-book-icon"
                        />
                      </div>
                      <span className="buy-span">Amazon</span>
                    </div>
                    <div className="buy-book-button">
                        <span className="buy-span">Buy on Amazon</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailsSection;
