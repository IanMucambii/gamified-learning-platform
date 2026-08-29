import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();
app.use(express.json());


app.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
})


