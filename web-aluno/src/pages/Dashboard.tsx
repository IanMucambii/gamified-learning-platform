import { useEffect, useState } from "react";
import { IconXP, IconStreak, IconAchievement, IconDone } from "./icons";
import { activityIcon } from "./activity-icon-map";

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

  if (error) {
    return <p>Your dashboard didn't load. Refresh to try again.</p>;
  }
  if (!data) {
    return <p>Loading your dashboard&hellip;</p>;
  }

  return (
    <>
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><IconXP /></div>
          <div>
            <span>Total XP</span>
            <h2>{data.totalXP.toLocaleString()}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><IconStreak /></div>
          <div>
            <span>Current streak</span>
            <h2>{data.streakDays} {data.streakDays === 1 ? "day" : "days"}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><IconAchievement /></div>
          <div>
            <span>Achievements</span>
            <h2>{data.achievementsCount}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><IconDone /></div>
          <div>
            <span>Activities done</span>
            <h2>{data.activitiesDone}</h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Today</h2>
            <p>{data.todaysActivities.length} activities lined up for you</p>
          </div>
        </div>

        <div className="activities-grid">
          {data.todaysActivities.map((a) => {
            const Icon = activityIcon[a.type];
            return (
              <div className="activity-card" key={a.id}>
                <div className="activity-icon"><Icon /></div>
                <div className="activity-content">
                  <span className={`difficulty ${a.difficulty}`}>{a.difficulty}</span>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                  <div className="activity-footer">
                    <span>{a.estimatedMinutes} min</span>
                    <span>+{a.xpReward} XP</span>
                  </div>
                  <button
                    className="play-button"
                    onClick={() => onPlayActivity(a.type, a.id)}
                  >
                    Start
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="progress-card">
        <div className="progress-info">
          <div>
            <strong>Weekly goal</strong>
            <span>{data.weeklyGoal.completed} of {data.weeklyGoal.target} activities</span>
          </div>
          <div>
            <strong>{data.weeklyGoal.percent}%</strong>
            <span>complete</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${data.weeklyGoal.percent}%` }} />
        </div>
      </section>
    </>
  );
}

export default Dashboard;