import express from "express";
import cors from "cors";
import diagnosisRoutes from "./routes/diagnosis.routes.js"; // stays the same

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/diagnosis", diagnosisRoutes);

export default app;
