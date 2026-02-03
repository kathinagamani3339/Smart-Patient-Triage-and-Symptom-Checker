import dotenv from "dotenv";
dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  rapidApiKey: process.env.AI_DIAGNOSIS_API_KEY,
  rapidApiHost: process.env.AI_DIAGNOSIS_API_HOST,
  rapidApiUrl: process.env.AI_DIAGNOSIS_API_URL,
};

// Validation
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export default env;
