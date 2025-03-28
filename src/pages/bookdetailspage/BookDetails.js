import React from "react";
import Navbar from "../../components/layouts/navbar/Navbar";
import Footer from "../../components/layouts/footer/Footer";
import DetailsSection from "../../components/layouts/details-section/DetailsSection";

function BookDetails() {
  return (
    <>
      <section>
        <Navbar darkTheme={true} />
        <DetailsSection />
        <Footer />
      </section>
    </>
  );
}

export default BookDetails;
