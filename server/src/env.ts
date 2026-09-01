import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

if (!process.env.MONGODB_URI) console.log("NO mongdb uri");

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: Number(process.env.PORT) || 5000,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
}