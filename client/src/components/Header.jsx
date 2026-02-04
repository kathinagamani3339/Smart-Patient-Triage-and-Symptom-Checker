import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
   // navbar
  const navLink = (path) =>
    `px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-white text-blue-600 font-semibold"
        : "text-white hover:bg-blue-500"
    }`;

  return (
    <header className="bg-[rgb(45_110_130)] shadow-md sticky top-0 z-50">
      <div className="ml-7 mx-auto flex justify-between items-center p-4">
        <h1 className="text-white text-xl font-bold tracking-wide text-left">
          AI Smart Triage
        </h1>

       {/* Navigations */}
        <nav className="flex gap-4">
          <Link to="/symptomsentry" className={navLink("/symptomsentry")}>
            SymptomsEntry
          </Link>

          <Link to="/triageresult" className={navLink("/triageresult")}>
            Triage Results
          </Link>

          <Link to="/providermap" className={navLink("/providermap")}>
            Nearby Clinics
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
