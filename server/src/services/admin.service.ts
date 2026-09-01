import User from "../models/User";
import Quiz from "../models/Quiz";
import Puzzle from "../models/Puzzle";
import ResonanceGame from "../models/ResonanceGame";
import QuizAttempt from "../models/QuizAttempt";
import PuzzleAttempt from "../models/PuzzleAttempt";
import ResonanceAttempt from "../models/ResonanceAttempt";

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getAdminDashboard() {
  const monthStart = startOfMonth();

  const [
    totalPatients,
    totalCaregivers,
    newPatientsThisMonth,
    newCaregiversThisMonth,
    quizCount,
    puzzleCount,
    resonanceCount,
    newActivitiesThisMonth,
    quizAttemptCount,
    puzzleAttemptCount,
    resonanceAttemptCount,
    recentPatients,
    recentQuizAttempts,
    recentPuzzleAttempts,
    recentResonanceAttempts,
  ] = await Promise.all([
    User.countDocuments({ role: "Patient" }),
    User.countDocuments({ role: "Doctor" }),
    User.countDocuments({ role: "Patient", createdAt: { $gte: monthStart } }),
    User.countDocuments({ role: "Doctor", createdAt: { $gte: monthStart } }),
    Quiz.countDocuments(),
    Puzzle.countDocuments(),
    ResonanceGame.countDocuments(),
    Promise.all([
      Quiz.countDocuments({ createdAt: { $gte: monthStart } }),
      Puzzle.countDocuments({ createdAt: { $gte: monthStart } }),
      ResonanceGame.countDocuments({ createdAt: { $gte: monthStart } }),
    ]).then(([q, p, r]) => q + p + r),
    QuizAttempt.countDocuments(),
    PuzzleAttempt.countDocuments(),
    ResonanceAttempt.countDocuments(),
    User.find({ role: "Patient" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("supervisor", "name")
      .select("name supervisor createdAt"),
    QuizAttempt.find().sort({ createdAt: -1 }).limit(5).populate("patient", "name").populate("quiz", "title"),
    PuzzleAttempt.find().sort({ createdAt: -1 }).limit(5).populate("patient", "name").populate("puzzle", "title"),
    ResonanceAttempt.find().sort({ createdAt: -1 }).limit(5).populate("student", "name").populate("game", "title"),
  ]);

  const totalActivities = quizCount + puzzleCount + resonanceCount;
  const totalAttempts = quizAttemptCount + puzzleAttemptCount + resonanceAttemptCount;

  const activityCategories =
    totalAttempts === 0
      ? []
      : [
          { key: "quiz", label: "Quizzes", icon: "📝", percent: Math.round((quizAttemptCount / totalAttempts) * 100) },
          { key: "puzzle", label: "Puzzles", icon: "🧩", percent: Math.round((puzzleAttemptCount / totalAttempts) * 100) },
          { key: "resonance", label: "Resonance", icon: "🎮", percent: Math.round((resonanceAttemptCount / totalAttempts) * 100) },
        ];

  const recentActivities = [
    ...recentQuizAttempts.map((a) => ({
      id: String(a._id),
      icon: "📝",
      title: (a.quiz as { title?: string } | null)?.title || "Quiz",
      patientName: (a.patient as { name?: string } | null)?.name || "Unknown patient",
      createdAt: a.createdAt,
    })),
    ...recentPuzzleAttempts.map((a) => ({
      id: String(a._id),
      icon: "🧩",
      title: (a.puzzle as { title?: string } | null)?.title || "Puzzle",
      patientName: (a.patient as { name?: string } | null)?.name || "Unknown patient",
      createdAt: a.createdAt,
    })),
    ...recentResonanceAttempts.map((a) => ({
      id: String(a._id),
      icon: "🎮",
      title: (a.game as { title?: string } | null)?.title || "Resonance session",
      patientName: (a.student as { name?: string } | null)?.name || "Unknown patient",
      createdAt: a.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalPatients,
    newPatientsThisMonth,
    totalCaregivers,
    newCaregiversThisMonth,
    totalActivities,
    newActivitiesThisMonth,
    activityCategories,
    recentPatients: recentPatients.map((p) => ({
      id: String(p._id),
      name: p.name,
      caregiverName: (p.supervisor as { name?: string } | null)?.name ?? null,
    })),
    recentActivities,
  };
}

export const getPatientsWithStats = async () => {
  const patients = await User.find({ role: "Patient" })
    .populate("supervisor", "name")
    .select("name email supervisor isApproved")
    .lean();

  const patientIds = patients.map((p) => p._id);

  const [quizStats, puzzleStats, resonanceStats] = await Promise.all([
    QuizAttempt.aggregate([
      { $match: { patient: { $in: patientIds } } },
      { $group: { _id: "$patient", count: { $sum: 1 }, lastActive: { $max: "$createdAt" } } },
    ]),
    PuzzleAttempt.aggregate([
      { $match: { patient: { $in: patientIds } } },
      { $group: { _id: "$patient", count: { $sum: 1 }, lastActive: { $max: "$createdAt" } } },
    ]),
    // NOTE: resonance uses `student`, not `patient` — the field-name quirk from the handoff
    ResonanceAttempt.aggregate([
      { $match: { student: { $in: patientIds } } },
      { $group: { _id: "$student", count: { $sum: 1 }, lastActive: { $max: "$createdAt" } } },
    ]),
  ]);

  const statsMap = new Map<string, { count: number; lastActive: Date | null }>();
  for (const bucket of [quizStats, puzzleStats, resonanceStats]) {
    for (const entry of bucket) {
      const id = entry._id.toString();
      const existing = statsMap.get(id) || { count: 0, lastActive: null };
      existing.count += entry.count;
      if (!existing.lastActive || entry.lastActive > existing.lastActive) {
        existing.lastActive = entry.lastActive;
      }
      statsMap.set(id, existing);
    }
  }

  return patients.map((patient: any) => {
    const stats = statsMap.get(patient._id.toString());
    return {
      id: patient._id.toString(),
      name: patient.name,
      email: patient.email,
      caregiver: patient.supervisor?.name || "Unassigned",
      isApproved: patient.isApproved,
      activities: stats?.count || 0,
      lastActive: stats?.lastActive ? stats.lastActive.toISOString() : null,
    };
  });
};

export const getCaregiversList = async () => {
  const caregivers = await User.find({ role: "Doctor" }).select("name").lean();
  return caregivers.map((c: any) => ({ id: c._id.toString(), name: c.name }));
};