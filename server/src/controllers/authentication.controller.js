import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  // Check for missing fields
  if (!name || !email || !password || !confirmpassword) {
    console.error("Registration failed: All fields are required");
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  // Check if passwords match
  if (password !== confirmpassword) {
    console.error("Registration failed: Password do not match");
    return res.status(400).json({ message: "Password do not match" });
  }

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`Registration failed: Email ${email} already exists`);
      return res
        .status(400)
        .json({ message: "Email already exists, Please login." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log(`User registered successfully: ${email}`);
    res
      .status(201)
      .json({ message: "Registration successful, Please login to continue." });
  } catch (err) {
    console.error("Server error during registration:", err.message);
    res.status(500).json({ message: "registration failed" });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check empty fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email is invalid" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // If email not found
    if (!user) {
      return res.status(404).json({
        message: "User not found, please register first",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    //Generate JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({ token, name: user.name });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//get user profile
export const getProfile = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const userData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };

    console.log(`Profile fetched for user: ${userData.email}`);
    res.status(200).json({ user: userData });
  } catch (err) {
    console.error("Server error while fetching profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
