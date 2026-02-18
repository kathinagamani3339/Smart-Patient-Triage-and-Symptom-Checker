import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  // Error messages state
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Remove error message for field while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Validation
    if (!formData.name) newErrors.name = "Enter a name";

    if (!formData.email) {
      newErrors.email = "Enter an email";
    } else {
      // Regex to validate most common email formats
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!formData.password) newErrors.password = "Enter a password";

    if (!formData.confirmpassword)
      newErrors.confirmpassword = "Confirm your password";

    if (
      formData.password &&
      formData.confirmpassword &&
      formData.password !== formData.confirmpassword
    ) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      // Send POST request to backend
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );

      // Show success message
      alert(res.data.message);

      // Navigate to login page
      navigate("/login");
    } catch (err) {
      // Handle backend errors
      if (err.response?.data?.message) {
        alert(err.response.data.message);

        // Clear form and errors
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        setErrors({});
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <IoPersonSharp className="w-12 h-12 text-blue-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">Register!</h2>

        {/* Name Field */}
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name}</p>
        )}

        {/* Email Field */}
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        {/* Password Field */}
        <div className="relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
          />
          {/* Eye Icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-500"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
          )}
        </div>
        {/* Confirm Password Field */}
        <div className="relative">
          <label className="block mb-1 font-medium">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmpassword"
            value={formData.confirmpassword}
            onChange={handleChange}
            className="w-full mb-4 p-2 border rounded [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
          />
          {/* Eye Icon */}
          <button
            type="button"
            onClick={() =>setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[38px] text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.confirmpassword && (
            <p className="text-red-500 text-sm mb-4">
              {errors.confirmpassword}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>

        {/* Redirect to Login */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
