import express, { Application } from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import materialRoutes from './routes/material.routes';
import quizRoutes from './routes/quiz.routes';
import puzzleRoutes from './routes/puzzle.routes';
import qnaRoutes from './routes/qna.routes';
import resonanceRoutes from './routes/resonance.routes';
import dashboardRoutes from './routes/dashboard.routes';
import activitiesRoutes from './routes/activities.routes';


const app: Application = express();
app.use(cors());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve material/resonance files

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/qna', qnaRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/resonance', resonanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activitiesRoutes);

app.use(errorHandler);

export default app;