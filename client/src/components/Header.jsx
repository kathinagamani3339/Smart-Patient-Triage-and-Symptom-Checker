import React, { useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State to toggle profile dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Logout function: remove token and name from localStorage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login", { replace: true });
  };

  // Helper function to check if a navigation tab is active
  const isActive = (path) => location.pathname === path;

  // Get the user's name from localStorage, default to "User"
  const userName = localStorage.getItem("name") || "User";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 px-6 py-4 flex justify-between items-center">
        {/* App Title */}
        <h1 className="text-lg font-semibold text-white">
          Smart Patient Triage
        </h1>

        {/* Navigation Tabs */}
        <div className="flex gap-2">
          {/* Symptoms Entry Tab */}
          <Link
            to="/symptomsentry"
            className={`px-4 py-2 rounded font-medium ${
              isActive("/symptomsentry")
                ? "bg-white text-blue-500"
                : "bg-blue-500 text-white"
            } hover:bg-blue-500 hover:text-white`}
          >
            Symptoms Entry
          </Link>

          {/* Triage Result Tab */}
          <Link
            to="/triageresult"
            className={`px-4 py-2 rounded font-medium ${
              isActive("/triageresult")
                ? "bg-white text-blue-500"
                : "bg-blue-500 text-white"
            } hover:bg-blue-500 hover:text-white`}
          >
            Triage Result
          </Link>

          {/* Provider Map Tab */}
          <Link
            to="/providermap"
            className={`px-4 py-2 rounded font-medium ${
              isActive("/providermap")
                ? "bg-white text-blue-500"
                : "bg-blue-500 text-white"
            } hover:bg-blue-500 hover:text-white`}
          >
            Provider Map
          </Link>
        </div>

        {/* Profile Section */}
        <div className="relative ml-4">
          {/* Profile Image / Icon */}
          <img
            src="/profile.png" // Replace with your profile image
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
          />

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-blue-500 font-medium">
              {/* Display current user's name */}
              <p className="px-4 py-2 border-b">{userName}</p>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white rounded-b"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Page Content: renders nested routes here */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
