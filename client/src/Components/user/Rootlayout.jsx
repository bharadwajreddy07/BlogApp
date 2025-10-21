import React from "react";
import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";
import { Outlet } from "react-router-dom";

function Rootlayout() {
  return (
    <div>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
export default Rootlayout;