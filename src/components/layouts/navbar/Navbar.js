import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.styles.css";
import { UserContext } from "../../../App";
import { auth } from "../../../firebase/firebase";
import { signOut } from "firebase/auth";
import { ReactComponent as ProfileIcon } from "../../../assets/profile-svg.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClose,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function Navbar({ darkTheme }) {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        alert("Logout Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section
      className={`navbar-container ${darkTheme ? "navbar-dark relative" : ""}`}
    >
      <div className="container flex justify-between align-center">
        <Link to="/" className="logo">
          Bookish
        </Link>
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {!menuOpen ? (
            <FontAwesomeIcon icon={faBars} />
          ) : (
            <FontAwesomeIcon icon={faClose} />
          )}
        </div>

        <nav
          className={`nav-links-container align-center justify-between ${
            menuOpen ? "active" : ""
          }`}
        >
          <div className="nav-menu">
            <Link to="/" className="nav-links">
              Home
            </Link>
            <Link to="/books" className="nav-links">
              Books
            </Link>
          </div>
          {user ? (
            <>
              <div className="nav-quick-action">
                <Link to="/library" className="nav-links ">
                  Library
                </Link>
                <Link to="/profile" className="nav-links profile-link">
                  <ProfileIcon
                    className="profile-icon"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                    }}
                  />
                </Link>

                <a onClick={handleLogout} className="nav-links logout-button">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="nav-quick-action">
                <Link to="/login" className="nav-links login-button">
                  Login
                </Link>
                <Link to="/signup" className="nav-links signup-button">
                  Sign up
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </section>
  );
}

export default Navbar;
