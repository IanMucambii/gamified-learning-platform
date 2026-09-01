import { useEffect, useState } from "react";

type ActivityType = "quiz" | "puzzle" | "resonance";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  xpReward: number;
}

interface Achievement {
  id: string;
  label: string;
  earned: boolean;
}

interface DashboardData {
  totalXP: number;
  streakDays: number;
  achievementsCount: number;
  achievements: Achievement[];
  activitiesDone: number;
  todaysActivities: Activity[];
  weeklyGoal: { completed: number; target: number; percent: number };
}

interface DashboardProps {
  onPlayActivity: (type: ActivityType, id: string) => void;
}

function Dashboard({ onPlayActivity }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  }, []);

  if (error) return <p>Couldn't load dashboard.</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div><span>Total XP</span><h2>{data.totalXP.toLocaleString()}</h2></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div><span>Day Streak</span><h2>{data.streakDays} Days</h2></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div><span>Achievements</span><h2>{data.achievementsCount}</h2></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div><span>Activities Done</span><h2>{data.activitiesDone}</h2></div>
        </div>
      </section>

      <section className="activities-grid">
        {data.todaysActivities.map((a) => (
          <div className="activity-card" key={a.id}>
            <h3>{a.title}</h3>
            <span className={`difficulty ${a.difficulty}`}>{a.difficulty}</span>
            <div className="activity-footer">
              <span>⏱ {a.estimatedMinutes} min</span>
              <span>⭐ +{a.xpReward} XP</span>
            </div>
            <button
              className="play-button"
              onClick={() => onPlayActivity(a.type, a.id)}
            >
              Play
            </button>
          </div>
        ))}
      </section>

      <section className="progress-card">
        <strong>{data.weeklyGoal.percent}%</strong>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${data.weeklyGoal.percent}%` }} />
        </div>
      </section>
    </>
  );
}

export default Dashboard;