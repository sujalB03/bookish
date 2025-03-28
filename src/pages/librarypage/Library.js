import React from "react";
import Navbar from "../../components/layouts/navbar/Navbar";
import Footer from "../../components/layouts/footer/Footer";
import LibraryBookContainer from "../../components/layouts/library-book-container/LibraryBookContainer";

function Library() {
  return (
    <>
      <Navbar darkTheme={true} />
      <LibraryBookContainer />
      <Footer />
    </>
  );
}

export default Library;
