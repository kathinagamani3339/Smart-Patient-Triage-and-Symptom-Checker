import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      const error = new Error("Please fill all required fields");
      error.statusCode = 400;
      throw error;
    }

    if (password !== confirmpassword) {
      const error = new Error("Password do not match");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("Email already exists, Please login.");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Registration successful, Please login to continue." });

  } catch (err) {
    next(err);   // 🔥 send exact error to global handler
  }
};


// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found, please register first");
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, name: user.name });

  } catch (err) {
    next(err);   // 🔥 exact error
  }
};


// Get profile
export const getProfile = async (req, res, next) => {
  try {
    const userData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };

    res.status(200).json({ user: userData });

  } catch (err) {
    next(err);  // 🔥 exact error
  }
};