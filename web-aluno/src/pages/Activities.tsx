import { useEffect, useState } from "react";
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
  completed: boolean;
}

interface ActivitiesProps {
  onPlayActivity: (type: ActivityType, id: string) => void;
}

function Activities({ onPlayActivity }: ActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadActivities() {
      try {
        const res = await fetch("/api/activities/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || `Request failed with status ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response shape from /api/activities");
        }

        if (!cancelled) setActivities(data);
      } catch (err) {
        if (!cancelled) setErrorMsg((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading activities&hellip;</p>;

  if (errorMsg) {
    return (
      <div className="activities-page">
        <p>Activities didn't load: {errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="page-title">
        <h2>Activities</h2>
        <p>Quizzes, matching puzzles, and memory games.</p>
      </div>

      {activities.length === 0 ? (
        <p>Nothing here yet. Check back soon.</p>
      ) : (
        <div className="activities-grid">
          {activities.map((a) => {
            const Icon = activityIcon[a.type];
            return (
              <div className="activity-card" key={`${a.type}-${a.id}`}>
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
                    {a.completed ? "Play again" : "Start"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Activities;