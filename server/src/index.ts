import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

app.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});


