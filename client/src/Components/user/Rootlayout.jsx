import React from "react";
import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";
import { Outlet } from "react-router-dom";

function Rootlayout() {
  return (
    <div>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="main-content" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default Rootlayout;