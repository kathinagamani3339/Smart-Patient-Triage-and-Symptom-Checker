
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate("/login");
    // here you can call your API to register the user
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <div className="mb-4 flex justify-center">
          <IoPersonSharp className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Register!</h2>

        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />

        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />

        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />

        <label className="block mb-1 font-medium">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />

        <label className="block mb-1 font-medium">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full mb-6 p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-blue-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-medium p-12"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Register;