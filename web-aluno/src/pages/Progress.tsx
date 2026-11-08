import { useEffect, useState } from "react";
import {
  getMe,
  getMyQuizAttempts,
  getMyPuzzleAttempts,
  getMyResonanceAttempts,
} from "../services/api";
import type {
  MeResponse,
  QuizAttemptRaw,
  PuzzleAttemptRaw,
  ResonanceAttemptRaw,
} from "../services/api";

interface ActivityPerformance {
  key: string;
  name: string;
  icon: string;
  completed: number;
  score: number; // average % across attempts, 0 if none
}

function avgPct(pairs: [number, number][]): number {
  const valid = pairs.filter(([, total]) => total > 0);
  if (!valid.length) return 0;
  const sum = valid.reduce((acc, [num, total]) => acc + (num / total) * 100, 0);
  return Math.round(sum / valid.length);
}

function Progress() {
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRaw[]>([]);
  const [puzzleAttempts, setPuzzleAttempts] = useState<PuzzleAttemptRaw[]>([]);
  const [resonanceAttempts, setResonanceAttempts] = useState<ResonanceAttemptRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token") ?? "";
      try {
        const [meData, quizzes, puzzles, resonance] = await Promise.all([
          getMe(token),
          getMyQuizAttempts(token),
          getMyPuzzleAttempts(token),
          getMyResonanceAttempts(token),
        ]);
        setProfile(meData);
        setQuizAttempts(quizzes);
        setPuzzleAttempts(puzzles);
        setResonanceAttempts(resonance);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="progress-page">Loading...</div>;
  if (error) return <div className="progress-page">Couldn't load progress.</div>;

  const byActivity: ActivityPerformance[] = [
    {
      key: "quiz",
      name: "Quizzes",
      icon: "📝",
      completed: quizAttempts.length,
      score: avgPct(quizAttempts.map((a) => [a.score, a.total])),
    },
    {
      key: "puzzle",
      name: "Puzzles",
      icon: "🧩",
      completed: puzzleAttempts.length,
      score: avgPct(puzzleAttempts.map((a) => [a.correctPairs, a.totalPairs])),
    },
    {
      key: "resonance",
      name: "Resonance",
      icon: "🎮",
      completed: resonanceAttempts.length,
      score: avgPct(resonanceAttempts.map((a) => [a.correctSelections, a.totalTargets])),
    },
  ];

  const activitiesCompleted = byActivity.reduce((sum, a) => sum + a.completed, 0);
  const scoredActivities = byActivity.filter((a) => a.completed > 0);
  const averageScore = scoredActivities.length
    ? Math.round(scoredActivities.reduce((sum, a) => sum + a.score, 0) / scoredActivities.length)
    : 0;

  return (
    <div className="progress-page">
      <div className="page-title">
        <h2>My Progress 📊</h2>
        <p>See how you are doing and keep working toward your goals.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div>
            <span>Activities Completed</span>
            <h2>{activitiesCompleted}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div>
            <span>Average Score</span>
            <h2>{averageScore}%</h2>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Activity Performance</h2>
            <p>Your performance in each activity.</p>
          </div>
        </div>

        <div className="performance-list">
          {byActivity.map((activity) => (
            <div className="performance-card" key={activity.key}>
              <div className="performance-icon">{activity.icon}</div>

              <div className="performance-content">
                <div className="performance-header">
                  <strong>{activity.name}</strong>
                  <span>{activity.score}%</span>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${activity.score}%` }}></div>
                </div>

                <span className="performance-completed">
                  {activity.completed} activities completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="encouragement-card">
        <div className="encouragement-icon">🌟</div>
        <div>
          <h3>Great job{profile ? `, ${profile.name.split(" ")[0]}` : ""}!</h3>
          <p>
            You are making good progress. Keep completing your activities and
            reach your weekly goal!
          </p>
        </div>
      </section>
    </div>
  );
}

export default Progress;