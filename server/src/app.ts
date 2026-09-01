import express, { Application } from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import materialRoutes from "./routes/material.routes";
import puzzleRoutes from "./routes/puzzle.routes";
import qnaRoutes from "./routes/qna.routes";
import quizRoutes from "./routes/quiz.routes";
import userRoutes from "./routes/user.routes";
import resonanceRoutes from './routes/resonance.routes';

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("api/auth", authRoutes);
app.use("api/users", userRoutes);
app.use("api/materials", materialRoutes);
app.use("api/puzzles", puzzleRoutes);
app.use("api/qna", qnaRoutes);
app.use("api/quizzes", quizRoutes);
app.use("api/resonance", resonanceRoutes);

app.use(errorHandler);

export default app;