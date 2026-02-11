import express from "express";
import {
  getNearbyClinics,
  getProviderDetails,
} from "../controllers/provider.controller.js";

const router = express.Router();

router.get("/nearby", getNearbyClinics);
router.get("/details", getProviderDetails);

export default router;
