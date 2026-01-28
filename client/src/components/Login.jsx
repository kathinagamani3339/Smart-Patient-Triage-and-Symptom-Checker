import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLock } from "react-icons/io";

const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error state
  const [errors, setErrors] = useState({});

  // Email format validation helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form submit handler
  const handleLogin = (e) => {
    e.preventDefault();

    let newErrors = {};

    // Email validations
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validations
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // If validation fails, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors before API call
    setErrors({});

    // Temporary log (replace with backend API call)
    console.log("Logging in with:", { email, password });

    // Temporary navigation (replace after backend integration)
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 w-full max-w-sm">
        
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <IoIosLock className="w-12 h-12 text-blue-500" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome!</h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-black"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-black"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-5 text-center text-blue-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline font-medium p-8">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
