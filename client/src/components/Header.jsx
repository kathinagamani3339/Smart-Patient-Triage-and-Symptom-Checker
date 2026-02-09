import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // profile icon

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize user from JWT token
  const token = localStorage.getItem("token");
  let initialUser = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      initialUser = { name: payload.name || "User" };
    } catch (err) {
      console.error("Failed to decode token", err);
      initialUser = null;
    }
  }

  const [user, setUser] = useState(initialUser);

  const navLink = (path) =>
    `px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-white text-blue-600 font-semibold"
        : "text-white hover:bg-blue-500"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // clear user state
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <header className="bg-[rgb(45_110_130)] shadow-md sticky top-0 z-50">
      <div className="ml-7 mx-auto flex justify-between items-center p-4">
        <h1 className="text-white text-xl font-bold tracking-wide text-left">
          AI Smart Triage
        </h1>

        {/* Left navigation */}
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

        {/* Profile icon */}
        {user && (
          <div className="relative ml-4">
            <FaUserCircle
              size={28}
              className="text-white cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-50">
                <p className="px-4 py-2 text-gray-800 font-semibold border-b">
                  {user.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
