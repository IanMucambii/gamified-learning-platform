import { useEffect, useState } from "react";
import { getMe, getMyStats } from "../services/api";
import type { MeResponse, OverallStats } from "../services/api";

function Progress() {
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token") ?? "";
      try {
        const [meData, statsData] = await Promise.all([
          getMe(token),
          getMyStats(token),
        ]);
        setProfile(meData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="progress-page">Loading...</div>;
  if (error || !stats) return <div className="progress-page">Couldn't load progress.</div>;

  const weeklyPct = Math.round(
    (stats.weeklyGoal.completed / stats.weeklyGoal.target) * 100
  );

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
            <h2>{stats.activitiesCompleted}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div>
            <span>Total XP</span>
            <h2>{stats.totalXp.toLocaleString()}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div>
            <span>Average Score</span>
            <h2>{stats.averageScore}%</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div>
            <span>Current Streak</span>
            <h2>{stats.currentStreak} Days</h2>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Weekly Goal 🎯</h2>
            <p>Keep completing activities this week.</p>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-info">
            <div>
              <strong>Activities</strong>
              <span>
                {stats.weeklyGoal.completed} of {stats.weeklyGoal.target} activities completed
              </span>
            </div>
            <strong>{weeklyPct}%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${weeklyPct}%` }}></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Activity Performance</h2>
            <p>Your performance in each activity.</p>
          </div>
        </div>

        <div className="performance-list">
          {stats.byActivity.map((activity) => (
            <div className="performance-card" key={activity.key}>
              <div className="performance-icon">{activity.icon}</div>

              <div className="performance-content">
                <div className="performance-header">
                  <strong>{activity.name}</strong>
                  <span>{activity.score}%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${activity.score}%` }}
                  ></div>
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