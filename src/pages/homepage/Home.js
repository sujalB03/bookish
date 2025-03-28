import React from "react";
import Showcase from "../../components/layouts/showcase/Showcase.js";
import Booklisting from "../../components/layouts/booklistinghome/Booklisting.js";
import Footer from "../../components/layouts/footer/Footer.js";
import GenreBasedBooklisting from "../../components/layouts/genrebasedbooklisting/GenreBasedBooklisting.js";

function HomePage() {
  return (
    <>
      <section>
        <Showcase />
        <Booklisting />
        <GenreBasedBooklisting category={"Nature"} />
        <GenreBasedBooklisting category={"Business & Economics"} />
        <GenreBasedBooklisting category={"Autobiography"} />
        <Footer />
      </section>
    </>
  );
}

export default HomePage;
