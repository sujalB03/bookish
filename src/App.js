import React, { createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Import pages
import Home from "./pages/homepage/Home";
import Books from "./pages/bookspage/Books";
import BookDetails from "./pages/bookdetailspage/BookDetails";
import Login from "./pages/authenticationpages/loginpage/Login";
import Signup from "./pages/authenticationpages/signuppage/Signup";
import Library from "./pages/librarypage/Library";
import Profile from "./pages/profilepage/Profile";
import NotFound from "./pages/notfoundpage/NotFound";

// context for authenticated users
export const UserContext = createContext({});
function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in");
        setAuthenticatedUser(user);
      } else {
        console.log("User is logged out");
        setAuthenticatedUser(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={authenticatedUser}>
      <Routes>
        {/* Static Route */}
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        {/* Dynamic Route */}
        <Route path="/book-details/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/library" element={<Library />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
