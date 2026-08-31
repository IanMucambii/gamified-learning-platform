import { Types } from "mongoose";
import QuizAttempt from "../models/QuizAttempt";
import PuzzleAttempt from "../models/PuzzleAttempt";

export async function getStudentStats(studentId: Types.ObjectId | string) {
  const quizAttempts = await QuizAttempt.find({ student: studentId }).populate("quiz", "title");
  const puzzleAttempts = await PuzzleAttempt.find({ student: studentId }).populate("puzzle", "title");
  return { quizAttempts, puzzleAttempts };
}

export async function getQuizLeaderboard() {
  return QuizAttempt.aggregate([
    { $group: { _id: "$student", totalScore: {$sum: "$score"}, attempts: {$sum: 1} } },
    { $sort: { totalScore: -1 } },
    { $limit: 10 },
  ]);
}

export async function getPuzzleLeaderboard() {
  return PuzzleAttempt.aggregate([
    { $group: { _id: "$student", totalCorrect: {$sum: "$correctPairs"}, attempts: {$sum: 1}}},
    { $sort: { totalScore: -1}},
    { $limit: 10 },
  ])
}