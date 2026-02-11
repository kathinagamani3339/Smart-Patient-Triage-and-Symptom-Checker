import axios from "axios";
import env from "../config/env.js";

export const getDiagnosisFromAI = async (payload) => {
  try {
    const response = await axios.post(env.rapidApiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": env.rapidApiKey,
        "X-RapidAPI-Host": env.rapidApiHost,
      },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("AI API error:", error.response?.data || error.message);

    throw new Error(error.response?.data?.message || "Failed to call AI API");
  }
};
