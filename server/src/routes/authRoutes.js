import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authentication.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/authentication.controller.js";

const router = express.Router();

// Protected route
router.get("/profile", verifyToken, getProfile);
// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

export default router;
