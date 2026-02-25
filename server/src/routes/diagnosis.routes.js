import express from "express";
import { analyzeTriage } from "../controllers/diagnosis.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze",verifyToken, analyzeTriage);

export default router;
