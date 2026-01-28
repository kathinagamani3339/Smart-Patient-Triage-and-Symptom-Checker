require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/diagnose", async (req, res) => {
  try {
    const axios = require("axios");

    const response = await axios.post(
      process.env.RAPID_API_URL,
      req.body,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": process.env.RAPID_API_HOST,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Diagnosis API error",
      error: error.response?.data || error.message
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
