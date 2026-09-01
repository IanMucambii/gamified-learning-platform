import { Types } from "mongoose";
import QuizAttempt from "../models/QuizAttempt";
import PuzzleAttempt from "../models/PuzzleAttempt";
import { getAllActivities } from "./activities.service"; // adjust path
import ResonanceAttempt from "../models/ResonanceAttempt";

export async function getStudentStats(studentId: Types.ObjectId | string) {
  const quizAttempts = await QuizAttempt.find({ patient: studentId }).populate("quiz", "title");
  const puzzleAttempts = await PuzzleAttempt.find({ patient: studentId }).populate("puzzle", "title");
  return { quizAttempts, puzzleAttempts };
}

export async function getQuizLeaderboard() {
  return QuizAttempt.aggregate([
    { $group: { _id: "$patient", totalScore: { $sum: "$score" }, attempts: { $sum: 1 } } },
    { $sort: { totalScore: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users", // or "patients" — whatever the actual collection is named
        localField: "_id",
        foreignField: "_id",
        as: "patientInfo",
      },
    },
    { $unwind: { path: "$patientInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalScore: 1,
        attempts: 1,
        name: "$patientInfo.name",
      },
    },
  ]);
}

export async function getPuzzleLeaderboard() {
  return PuzzleAttempt.aggregate([
    { $group: { _id: "$patient", totalCorrect: { $sum: "$correctPairs" }, attempts: { $sum: 1 } } },
    { $sort: { totalCorrect: -1 } }, // was sorting on a field that doesn't exist
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "patientInfo",
      },
    },
    { $unwind: { path: "$patientInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalCorrect: 1,
        attempts: 1,
        name: "$patientInfo.name",
      },
    },
  ]);
}

export async function getDashboardData(studentId: Types.ObjectId | string) {
  const [quizAttempts, puzzleAttempts, activities] = await Promise.all([
    QuizAttempt.countDocuments({ patient: studentId }),
    PuzzleAttempt.countDocuments({ patient: studentId }),
    getAllActivities(studentId),
  ]);
  const resonanceAttempts = await ResonanceAttempt.countDocuments({ student: studentId });

  return {
    activitiesDone: quizAttempts + puzzleAttempts + resonanceAttempts,
    activities,
  };
}