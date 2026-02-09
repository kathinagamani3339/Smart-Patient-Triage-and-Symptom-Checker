import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import diagnosisRoutes from "./routes/diagnosis.routes.js"; // stays the same
import providerRoutes from "./routes/provider.routes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();
//middileware
app.use(cors());
app.use(express.json());
//Routes
app.use("/api/auth", authRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/providers", providerRoutes);

export default app;
