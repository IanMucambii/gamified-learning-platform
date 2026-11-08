import { Types } from 'mongoose';
import Quiz from '../models/Quiz';
import Puzzle from '../models/Puzzle';
import ResonanceGame from '../models/ResonanceGame';
import QuizAttempt from '../models/QuizAttempt';
import PuzzleAttempt from '../models/PuzzleAttempt';
import ResonanceAttempt from '../models/ResonanceAttempt';

export type ActivityType = 'quiz' | 'puzzle' | 'resonance';

export interface ActivityCard {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  xpReward: number;
  completed: boolean;
}

export async function getAllActivities(studentId: Types.ObjectId | string): Promise<ActivityCard[]> {
  const [quizzes, puzzles, games, quizAttempts, puzzleAttempts, resonanceAttempts] = await Promise.all([
    Quiz.find(),
    Puzzle.find(),
    ResonanceGame.find(),
    QuizAttempt.find({ patient: studentId }).select('quiz'),
    PuzzleAttempt.find({ patient: studentId }).select('puzzle'),
    ResonanceAttempt.find({ student: studentId }).select('game'),
  ]);

  const attemptedQuizIds = new Set(quizAttempts.map((a) => String(a.quiz)));
  const attemptedPuzzleIds = new Set(puzzleAttempts.map((a) => String(a.puzzle)));
  const attemptedGameIds = new Set(resonanceAttempts.map((a) => String(a.game)));

  const quizCards: ActivityCard[] = quizzes.map((q) => ({
    id: String(q._id),
    type: 'quiz',
    title: q.title,
    description: 'Remember and select the correct answers.',
    difficulty: q.difficulty,
    estimatedMinutes: q.estimatedMinutes,
    xpReward: q.xpReward,
    completed: attemptedQuizIds.has(String(q._id)),
  }));

  const puzzleCards: ActivityCard[] = puzzles.map((p) => ({
    id: String(p._id),
    type: 'puzzle',
    title: p.title,
    description: 'Find the missing piece and match the pairs.',
    difficulty: p.difficulty,
    estimatedMinutes: p.estimatedMinutes,
    xpReward: p.xpReward,
    completed: attemptedPuzzleIds.has(String(p._id)),
  }));

  const gameCards: ActivityCard[] = games.map((g) => ({
    id: String(g._id),
    type: 'resonance',
    title: g.title,
    description: 'Memorize the images, then find them again.',
    difficulty: g.difficulty,
    estimatedMinutes: g.estimatedMinutes,
    xpReward: g.xpReward,
    completed: attemptedGameIds.has(String(g._id)),
  }));

  return [...quizCards, ...puzzleCards, ...gameCards];
}