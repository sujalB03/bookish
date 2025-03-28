import React, { useContext, useEffect, useRef, useState } from "react";
import "./profile.styles.css";
import { UserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layouts/navbar/Navbar";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  EmailAuthProvider,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import editIcon from "../../assets/edit-img.svg";
import { Country, State } from "country-state-city";
import Select from "react-select";

// const avatars = [
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=1",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=2",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=3",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=4",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=5",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=6",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=7",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=8",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=9",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=10",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=11",
//   "https://api.dicebear.com/7.x/lorelei/svg?seed=12",
// ];
const Profile = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [phone, setPhone] = useState(user?.phone || "");
  const [name, setName] = useState(user?.name || "");
  const [memberSince, setMemberSince] = useState(user?.createdAt || "");
  const [recentBooks, setRecentBooks] = useState([]);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [infoSuccess, setInfoSuccess] = useState("");
  const [infoError, setInfoError] = useState("");
  const scrollRef = useRef(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [canScroll, setCanScroll] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.profilePhoto || ""
  );
  const [avatarSeed, setAvatarSeed] = useState(1);

  const [selectedCountry, setSelectedCountry] = useState(user?.country || null);
  const [selectedState, setSelectedState] = useState(user?.state || null);
  const db = getFirestore();
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const createdAt = new Date(userData.createdAt.seconds * 1000);
            const createdAtDate = createdAt.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            setPhone(userData.phone || "Not Available");
            setName(userData.name || "");
            setRecentBooks(userData.recentlyViewed || []);
            setMemberSince(createdAtDate || "Not Available");
            setSelectedAvatar(userData.profilePhoto || "");

            const countryObj = countryOptions.find(
              (c) => c.label === userData.country
            );
            setSelectedCountry(countryObj || null);

            setSelectedState(
              userData.state
                ? { value: userData.state, label: userData.state }
                : null
            );

            console.log(selectedState);
            const libraryRef = collection(db, "users", user.uid, "library");
            const librarySnap = await getDocs(libraryRef);
            const libraryBooks = librarySnap.docs.map((doc) => doc.data());

            setLibraryBooks(libraryBooks || []); // Fetch user's saved books
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Function to check if scrolling is needed
  const checkScrollable = () => {
    if (scrollRef.current) {
      setCanScroll(
        scrollRef.current.scrollWidth > scrollRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScrollable();

    window.addEventListener("resize", checkScrollable);

    return () => window.removeEventListener("resize", checkScrollable);
  }, [recentBooks]); // Re-run when books change

  const changePassword = async (currentPassword, newPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is signed in.");
      return;
    }

    try {
      // Step 1: Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      // console.log("Reauthentication successful");

      // Step 2: Update Password
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully!");
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = error.message;

      // Custom error messages
      if (errorCode === "auth/invalid-credential") {
        errorMessage = "Incorrect Current Password";
      } else if (errorCode === "auth/password-does-not-meet-requirements") {
        errorMessage =
          "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      } else if (
        errorCode === "auth/too-many-requests" ||
        "auth/too-many-request"
      ) {
        errorMessage = "Please try again later.";
      }

      setError(errorMessage);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      setError("Current password cannot be empty!");
      return;
    }

    if (!newPassword) {
      setError("New password cannot be empty!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match!");
      return;
    }
    await changePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (user?.profilePhoto) {
      setSelectedAvatar(user.profilePhoto);
    }
  }, [user]);

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
    setModalIsOpen(false);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { profilePhoto: avatar });
  };

  const loadMoreAvatars = () => {
    setAvatarSeed(avatarSeed + 12); // Increase the seed for next batch (Next 12 avatars)
  };

  // Convert country data into react-select options
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  // Get cities based on selected country
  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.name,
        label: state.name,
      }))
    : [];

  const handleSaveChanges = async () => {
    if (!name) {
      setInfoError("Name cannot be empty!");
      return;
    }
    if (!phone || phone.toString().length !== 10) {
      setInfoError("Phone number must be exactly 10 digits.");
      return;
    }
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name,
        phone,
        country: selectedCountry?.label || "",
        state: selectedState?.label || "",
      });
      setInfoSuccess("Profile updated successfully!");
      // Hide success message after 4 seconds
      setTimeout(() => {
        setInfoSuccess("");
      }, 4000);
    } catch (error) {
      setInfoError("Failed to update profile. Try again.");
    }
  };

  const deleteUserAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirmDelete) return;

    try {
      const userId = user.uid;

      // Delete Firestore data (delete the library subcollection first)
      const libraryRef = collection(db, "users", userId, "library");
      const libraryDocs = await getDocs(libraryRef);
      const deleteLibraryPromises = libraryDocs.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deleteLibraryPromises);

      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", userId));

      // Delete user from Firebase Authentication
      await deleteUser(user);

      alert("Your account has been deleted successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please re-login and try again.");
    }
  };
  return (
    <>
      <Navbar darkTheme={true} />
      {user ? (
        <div className="profile-page-container container">
          <h1 className="profile-heading">My Profile</h1>
          <div className="profile-pic-container">
            <div className="profile-picture-section">
              {/* Profile Picture */}
              <img
                src={
                  selectedAvatar ||
                  `https://ui-avatars.com/api/?name=${user?.displayName}`
                }
                alt="Profile Avatar"
                className="profile-avatar"
              />

              {/* User Details */}
              <div className="profile-user-details">
                <h2 className="profile-username">{name || "User"}</h2>
                <p className="profile-email">{user?.email}</p>
                <p className="profile-role">
                  Member since: {memberSince || "N/A"}
                </p>
              </div>
            </div>

            {/* Edit Profile Button*/}
            <div
              className="profile-edit-icon"
              onClick={() => setModalIsOpen(true)}
            >
              <img src={editIcon} alt="Edit Profile" />
              <span>Update Picture</span>
            </div>
            {/* Modal Popup */}
            {modalIsOpen && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Select an Avatar</h2>
                  <div className="avatar-grid">
                    {[...Array(12)].map((_, index) => {
                      const seed = avatarSeed + index;
                      return (
                        <img
                          key={seed}
                          src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`}
                          alt={`Avatar ${seed}`}
                          className="avatar-option"
                          onClick={() =>
                            handleAvatarSelect(
                              `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`
                            )
                          }
                        />
                      );
                    })}
                  </div>
                  <button
                    className="load-more-button"
                    onClick={loadMoreAvatars}
                  >
                    Load More
                  </button>
                  <button
                    className="close-button"
                    onClick={() => setModalIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="profile-container">
            {/* First Column: User Info */}
            <div className="profile-info-section">
              <h2>Basic Information</h2>

              <div className="profile-info-item">
                <label>Name</label>
                <input
                  type="text"
                  className="profile-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="profile-info-item">
                <label>Username</label>
                <input
                  type="text"
                  className="profile-input"
                  value={user?.displayName || "Guest"}
                  readOnly
                />
              </div>

              <div className="profile-info-item">
                <label>Email</label>
                <input
                  type="email"
                  className="profile-input"
                  value={user?.email || "NA"}
                  readOnly
                />
              </div>

              <div className="profile-info-item">
                <label>Phone</label>
                <input
                  type="tel"
                  className="profile-input"
                  value={phone}
                  maxLength={10}
                  placeholder="Enter phone number"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setPhone(value);
                  }}
                />
              </div>

              {/* Country Dropdown */}
              <div className="profile-info-item">
                <label>Country</label>
                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(country) => {
                    setSelectedCountry(country);
                    setSelectedState(null); // Reset state when country changes
                  }}
                  placeholder="Select Country"
                />
              </div>

              {/* State Dropdown (Depends on Country) */}
              <div className="profile-info-item">
                <label>State</label>
                <Select
                  options={stateOptions}
                  value={selectedState}
                  onChange={(state) => setSelectedState(state)}
                  placeholder="Select State"
                  isDisabled={!selectedCountry} // Disable if no country is selected
                />
              </div>
              {infoSuccess ? (
                <p className="success-message success-msg">{infoSuccess}</p>
              ) : infoError ? (
                <p className="error-message current-pass-error">{infoError}</p>
              ) : null}
              <button className="update-button" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>

            {/* Second Column: Change Password */}
            <div className="profile-password-section">
              <h2>Change Password</h2>

              <div className="profile-info-item">
                <label>Current Password</label>
                <input
                  type="password"
                  className="profile-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="profile-info-item">
                <label>New Password</label>
                <input
                  type="password"
                  className="profile-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="profile-info-item">
                <label>Retype New Password</label>
                <input
                  type="password"
                  className="profile-input"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              {success ? (
                <p className="success-message success-msg">{success}</p>
              ) : error ? (
                <p className="error-message current-pass-error">{error}</p>
              ) : null}

              <button className="update-button" onClick={handlePasswordChange}>
                Update Password
              </button>
            </div>
          </div>

          {/* Recently Viewed Books Section */}
          <div className="recent-books-container">
            <h2>Recently Viewed Books</h2>
            {recentBooks.length === 0 ? (
              <p>No recently viewed books.</p>
            ) : (
              <div className="recent-books-wrapper">
                {canScroll && (
                  <button
                    className="scroll-button left"
                    onClick={() => scroll("left")}
                  >
                    <FaChevronLeft />
                  </button>
                )}

                <div className="recent-books-list" ref={scrollRef}>
                  {recentBooks.map((book) => (
                    <Link
                      to={`/book-details/${book.id}`}
                      key={book.id}
                      className="recent-book-card"
                    >
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail}
                        alt={book.volumeInfo.title}
                      />
                      <p title={book.volumeInfo.title}>
                        {book.volumeInfo.title}
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
          </div>

          {/* My Library Section */}
          <div className="my-library-container">
            <h2>My Library</h2>
            {libraryBooks.length > 0 ? (
              <div className="library-preview">
                {libraryBooks.slice(0, 2).map((book, index) => (
                  <div key={index} className="library-book">
                    <img
                      src={
                        book.volumeInfo?.imageLinks?.thumbnail ||
                        "placeholder.jpg"
                      }
                      alt={book.volumeInfo?.title || "No Title"}
                    />
                    <div className="library-book-details">
                      <h3>{book.volumeInfo?.title}</h3>
                      <p>
                        {book.volumeInfo?.authors?.join(", ") ||
                          "Unknown Author"}
                      </p>
                      <Link
                        to={`/book-details/${book.id}`}
                        className="view-details"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Your library is empty! Start adding books you love.</p>
            )}
            {libraryBooks.length > 2 && (
              <button onClick={() => navigate("/library")}>View All</button>
            )}
          </div>

          {/* Account Settings Section */}
          <div className="account-settings">
            <h2>Delete Account</h2>

            <div className="settings-option">
              <p>This action is irreversible.</p>
              <button className="delete-btn" onClick={deleteUserAccount}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-page-container container">
          <p>
            Please{" "}
            <Link to="/login" style={{ color: "#fbb500" }}>
              sign in
            </Link>{" "}
            to view your profile.
          </p>
        </div>
      )}
      <footer className="footer">
        © {new Date().getFullYear()} Bookish. All Rights Reserved.
      </footer>
    </>
  );
};

export default Profile;
