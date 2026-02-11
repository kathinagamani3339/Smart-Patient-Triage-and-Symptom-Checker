import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Collect important environment variables in a single object
const env = {
  port: process.env.PORT || 5000,
  rapidApiKey: process.env.AI_DIAGNOSIS_API_KEY,
  rapidApiHost: process.env.AI_DIAGNOSIS_API_HOST,
  rapidApiUrl: process.env.AI_DIAGNOSIS_API_URL,
};

// Validate that all required environment variables are present
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing environment variable: ${key}`);
    throw new Error(`Missing environment variable: ${key}`);
  } else {
    console.log(`Environment variable loaded: ${key}`);
  }
});

export default env;
