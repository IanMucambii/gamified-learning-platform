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
import statsRoutes from './routes/stats.routes';
import adminRoutes from './routes/admin.routes';


const app: Application = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];


//original CORS configuration
// {
//   origin: (origin, callback) => {
//     // allow requests with no origin (curl, mobile apps, etc.)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

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
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;