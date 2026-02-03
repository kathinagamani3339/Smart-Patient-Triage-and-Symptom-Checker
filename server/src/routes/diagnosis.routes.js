import express from "express";
import { analyzeTriage } from "../controllers/diagnosis.controller.js";

const router = express.Router();

router.post("/analyze", analyzeTriage);

export default router;
