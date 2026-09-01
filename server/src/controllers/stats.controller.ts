import { Request, Response, NextFunction } from "express";
import QuizAttempt from "../models/QuizAttempt";
import PuzzleAttempt from "../models/PuzzleAttempt";
import ResonanceAttempt from "../models/ResonanceAttempt";

const WEEKLY_GOAL = 5;

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function calculateStreak(dateKeys: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // no activity today yet? streak can still be "alive" via yesterday
  if (!dateKeys.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dateKeys.has(toDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

const avg = (nums: number[]) =>
  nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : 0;

export async function getMyOverallStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const studentId = req.user!._id;

    const [quizAttempts, puzzleAttempts, resonanceAttempts] = await Promise.all([
      QuizAttempt.find({ patient: studentId }).populate("quiz", "xpReward"),
      PuzzleAttempt.find({ patient: studentId }).populate("puzzle", "xpReward"),
      ResonanceAttempt.find({ student: studentId }).populate("game", "xpReward"),
    ]);

    const quizScores = quizAttempts.map((a) => (a.score / a.total) * 100);
    const puzzleScores = puzzleAttempts.map(
      (a) => (a.correctPairs / a.totalPairs) * 100
    );
    const resonanceScores = resonanceAttempts.map(
      (a) => (a.correctSelections / a.totalTargets) * 100
    );

    const sumXp = (attempts: any[], activityField: string) =>
      attempts.reduce((sum, a) => sum + (a[activityField]?.xpReward ?? 0), 0);

    const totalXp =
      sumXp(quizAttempts, "quiz") +
      sumXp(puzzleAttempts, "puzzle") +
      sumXp(resonanceAttempts, "game");

    const allDates = [
      ...quizAttempts.map((a) => a.createdAt),
      ...puzzleAttempts.map((a) => a.createdAt),
      ...resonanceAttempts.map((a) => a.createdAt),
    ];
    const dateKeys = new Set(allDates.map((d) => toDateKey(new Date(d))));
    const currentStreak = calculateStreak(dateKeys);

    const weekStart = startOfWeek(new Date());
    const activitiesThisWeek = allDates.filter(
      (d) => new Date(d) >= weekStart
    ).length;

    res.json({
      totalXp,
      activitiesCompleted:
        quizAttempts.length + puzzleAttempts.length + resonanceAttempts.length,
      averageScore: avg([...quizScores, ...puzzleScores, ...resonanceScores]),
      currentStreak,
      weeklyGoal: {
        target: WEEKLY_GOAL,
        completed: Math.min(activitiesThisWeek, WEEKLY_GOAL),
      },
      byActivity: [
        {
          key: "resonance",
          name: "Memory Match",
          icon: "🧠",
          completed: resonanceAttempts.length,
          score: avg(resonanceScores),
        },
        {
          key: "puzzle",
          name: "Picture Recognition",
          icon: "🖼️",
          completed: puzzleAttempts.length,
          score: avg(puzzleScores),
        },
        {
          key: "quiz",
          name: "Word Recall",
          icon: "💭",
          completed: quizAttempts.length,
          score: avg(quizScores),
        },
      ],
    });
  } catch (error) {
    next(error);
  }
}