import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLock } from "react-icons/io";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.email) {
      alert("Please enter email");
      return;
    }

    if (!formData.password) {
      alert("Please enter password");
      return;
    }

    try {
      // Send POST request to backend login endpoint
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // Save JWT token and user name in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);

      // Optional: show success message
      alert("Login successful");

      // Navigate to Symptoms Entry page
      navigate("/symptomsentry");
    } catch (err) {
      // Handle backend errors
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 w-full max-w-sm">
        <div className="mb-4 flex justify-center">
          <IoIosLock className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome!</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md transition"
          >
            Login
          </button>
        </form>
        <p className="mt-5 text-center text-blue-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline font-medium p-8"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
