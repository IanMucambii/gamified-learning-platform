import { useEffect, useState, type ReactElement } from "react";

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

// Small line-icon set, drawn in-house instead of emoji so the icon color
// tracks the palette (moss / amber) rather than the OS emoji set.
function IconXP() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v11" strokeLinecap="round" />
      <path d="M7 9l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 17.5c2 1.3 4.5 2 7 2s5-.7 7-2" strokeLinecap="round" />
    </svg>
  );
}

function IconStreak() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 21c3.6 0 6.5-2.6 6.5-6.3 0-3-2-5-3.3-7.2-.3 1.7-1.2 2.9-2.3 3.2.4-2.6-.6-5.2-2.7-6.7.5 2.4-.5 4.4-2.2 6-1.3 1.2-2.5 2.7-2.5 4.7C5.5 18.4 8.4 21 12 21Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAchievement() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <path d="M15.5 16.5l1.7 1.7 3-3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconQuiz() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 9a3 3 0 1 1 4 2.8c-.9.4-1.5 1-1.5 2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconPuzzle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M6 8h3.2a1.6 1.6 0 1 1 0 2.6V13H6v-3a1.5 1.5 0 1 0 0-2Z"
        strokeLinejoin="round"
      />
      <path d="M9.2 13v5.2a1.5 1.5 0 1 1-2.6 0H4V13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.2 10.6H16v2.6a1.6 1.6 0 1 1 0 3.1V19H9.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconResonance() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="12" r="5.5" opacity="0.7" />
      <circle cx="12" cy="12" r="9" opacity="0.4" />
    </svg>
  );
}

const activityIcon: Record<ActivityType, () => ReactElement> = {
  quiz: IconQuiz,
  puzzle: IconPuzzle,
  resonance: IconResonance,
};

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