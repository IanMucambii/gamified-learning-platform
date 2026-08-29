import mongoose from "mongoose";
import { env } from "./env";

export default async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Connection Failed", (error as Error).message);
    process.exit(1);
  }
}