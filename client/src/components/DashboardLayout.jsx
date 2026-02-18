import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5"; 

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State to toggle profile dropdown menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Logout function remove token and name from localStorage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("name");
    navigate("/login", { replace: true });
  };

  // Helper to check if a navigation link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 px-6 py-4 flex justify-between items-center relative">
        {/* App Title */}
        <h1 className="text-lg font-semibold text-white">
          Smart Patient Triage
        </h1>

        {/* Navigation Links */}
        <div className="flex gap-2">
          {/* Symptoms Entry Link */}
          <Link
            to="/symptomsentry"
            className={`px-4 py-2 rounded font-medium ${
              isActive("/symptomsentry")
                ? "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
                : "bg-blue-500 text-white hover:bg-blue-500 hover:text-white"
            }`}
          >
            Symptoms Entry
          </Link>

          {/* Triage Result Link */}
          <Link
            to="/triageresult"
            className={`px-4 py-2 rounded font-medium ${
              isActive("/triageresult")
                ? "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
                : "bg-blue-500 text-white hover:bg-blue-500 hover:text-white"
            }`}
          >
            Triage Result
          </Link>

          {/* Provider Map Link */}
          <Link
            to="/providermap"
            className={`px-4 py-2 rounded font-medium ${
              isActive("/providermap")
                ? "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
                : "bg-blue-500 text-white hover:bg-blue-500 hover:text-white"
            }`}
          >
            Provider Map
          </Link>
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <IoPersonSharp
            className="w-10 h-10 text-white cursor-pointer border-2 rounded-full p-1"
            onClick={() => setShowProfileMenu(!showProfileMenu)} // Toggle dropdown menu
          />

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-blue-500 font-medium z-50">
              {/* Display user's name */}
              <p className="px-4 py-2 border-b">
                {localStorage.getItem("name")}
              </p>
              {/* Logout button */}
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

      {/* Main content area: renders nested routes */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
