import express from "express";
import cors from "cors";
import diagnosisRoutes from "./routes/diagnosis.routes.js"; // stays the same
import providerRoutes from "./routes/provider.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/providers", providerRoutes);

export default app;
