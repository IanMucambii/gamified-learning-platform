import { Types } from 'mongoose';
import QuizAttempt from '../models/QuizAttempt';
import PuzzleAttempt from '../models/PuzzleAttempt';
import ResonanceAttempt from '../models/ResonanceAttempt';
import Quiz from '../models/Quiz';
import Puzzle from '../models/Puzzle';
import ResonanceGame from '../models/ResonanceGame';

const WEEKLY_GOAL_TARGET = 5;

function startOfWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function calcStreak(dates: Date[]): number {
  const uniqueDays = Array.from(new Set(dates.map(dateKey))).sort().reverse();
  if (uniqueDays.length === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const dayStr of uniqueDays) {
    const expected = dateKey(cursor);
    if (dayStr === expected) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (dayStr < expected) {
      break; // gap — streak ends
    }
  }
  return streak;
}

export async function getPatientDashboard(studentId: Types.ObjectId | string) {
  const [quizAttempts, puzzleAttempts, resonanceAttempts] = await Promise.all([
    QuizAttempt.find({ patient: studentId }),
    PuzzleAttempt.find({ patient: studentId }),
    ResonanceAttempt.find({ student: studentId }),
  ]);

  const activitiesDone = quizAttempts.length + puzzleAttempts.length + resonanceAttempts.length;

  // XP: 10 XP per correct quiz answer, 10 per correct puzzle pair, 10 per correct resonance pick
  const quizXP = quizAttempts.reduce((sum, a) => sum + a.score * 10, 0);
  const puzzleXP = puzzleAttempts.reduce((sum, a) => sum + a.correctPairs * 10, 0);
  const resonanceXP = resonanceAttempts.reduce((sum, a) => sum + a.correctSelections * 10, 0);
  const totalXP = quizXP + puzzleXP + resonanceXP;

  // Streak: consecutive days (ending today) with at least one attempt of any kind
  const allDates = [
    ...quizAttempts.map((a) => a.createdAt as unknown as Date),
    ...puzzleAttempts.map((a) => a.createdAt as unknown as Date),
    ...resonanceAttempts.map((a) => a.createdAt as unknown as Date),
  ];
  const streakDays = calcStreak(allDates);

  // Weekly goal
  const weekStart = startOfWeek();
  const completedThisWeek = allDates.filter((d) => d >= weekStart).length;
  const weeklyGoal = {
    completed: Math.min(completedThisWeek, WEEKLY_GOAL_TARGET),
    target: WEEKLY_GOAL_TARGET,
    percent: Math.min(100, Math.round((completedThisWeek / WEEKLY_GOAL_TARGET) * 100)),
  };

  // Achievements (simple rule-based badges)
  const hadPerfectQuiz = quizAttempts.some((a) => a.total > 0 && a.score === a.total);
  const achievementDefs = [
    { id: 'first_quiz', label: 'First Quiz Completed', earned: quizAttempts.length >= 1 },
    { id: 'first_puzzle', label: 'First Puzzle Solved', earned: puzzleAttempts.length >= 1 },
    { id: 'first_memory_game', label: 'First Memory Game Played', earned: resonanceAttempts.length >= 1 },
    { id: 'ten_activities', label: '10 Activities Completed', earned: activitiesDone >= 10 },
    { id: 'three_day_streak', label: '3-Day Streak', earned: streakDays >= 3 },
    { id: 'seven_day_streak', label: '7-Day Streak', earned: streakDays >= 7 },
    { id: 'perfect_quiz', label: 'Perfect Quiz Score', earned: hadPerfectQuiz },
  ];
  const achievements = achievementDefs.filter((a) => a.earned);

  // Today's activities: not-yet-attempted items across all three types, capped at 3
  const attemptedQuizIds = new Set(quizAttempts.map((a) => String(a.quiz)));
  const attemptedPuzzleIds = new Set(puzzleAttempts.map((a) => String(a.puzzle)));
  const attemptedGameIds = new Set(resonanceAttempts.map((a) => String(a.game)));

  const [quizzes, puzzles, games] = await Promise.all([
    Quiz.find({ _id: { $nin: Array.from(attemptedQuizIds) } }).limit(5),
    Puzzle.find({ _id: { $nin: Array.from(attemptedPuzzleIds) } }).limit(5),
    ResonanceGame.find({ _id: { $nin: Array.from(attemptedGameIds) } }).limit(5),
  ]);

  const todaysActivities = [
  ...quizzes.map((q) => ({
    id: String(q._id),
    type: 'quiz' as const,
    title: q.title,
    description: 'Remember and select the correct answers.',
    difficulty: q.difficulty,
    estimatedMinutes: q.estimatedMinutes,
    xpReward: q.xpReward,
  })),
  ...puzzles.map((p) => ({
    id: String(p._id),
    type: 'puzzle' as const,
    title: p.title,
    description: 'Find the missing piece and match the pairs.',
    difficulty: p.difficulty,
    estimatedMinutes: p.estimatedMinutes,
    xpReward: p.xpReward,
  })),
  ...games.map((g) => ({
    id: String(g._id),
    type: 'resonance' as const,
    title: g.title,
    description: 'Memorize the images, then find them again.',
    difficulty: g.difficulty,
    estimatedMinutes: g.estimatedMinutes,
    xpReward: g.xpReward,
  })),
].slice(0, 3);

  return {
    totalXP,
    streakDays,
    achievementsCount: achievements.length,
    achievements,
    activitiesDone,
    todaysActivities,
    weeklyGoal,
  };
}