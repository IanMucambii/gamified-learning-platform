import { useEffect, useState } from 'react';

type ActivityType = 'quiz' | 'puzzle' | 'resonance';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  xpReward: number;
  completed: boolean;
}

const ICONS: Record<ActivityType, string> = {
  quiz: '💭',
  puzzle: '🔷',
  resonance: '🖼️',
};

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
        const res = await fetch('/api/activities', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!res.ok) {
          // Surface backend errors (401, 500, etc.) instead of silently
          // failing or crashing on a non-array payload.
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || `Request failed with status ${res.status}`);
        }

        const data = await res.json();

        // Guard against a malformed/unexpected payload shape.
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response shape from /api/activities');
        }

        if (!cancelled) setActivities(data);
      } catch (err) {
        console.error(err);
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

  if (loading) return <p>Loading activities...</p>;

  if (errorMsg) {
    return (
      <div className="activities-page">
        <p>Could not load activities: {errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="page-title">
        <h2>Activities 🎮</h2>
        <p>Choose an activity and have fun while exercising your memory.</p>
      </div>

      {activities.length === 0 ? (
        <p>No activities available yet.</p>
      ) : (
        <div className="activities-grid">
          {activities.map((a) => (
            <div className="activity-card" key={`${a.type}-${a.id}`}>
              <div className="activity-icon">{ICONS[a.type]}</div>

              <div className="activity-content">
                <span className={`difficulty ${a.difficulty}`}>
                  {a.difficulty.charAt(0).toUpperCase() + a.difficulty.slice(1)}
                </span>

                <h3>{a.title}</h3>
                <p>{a.description}</p>

                <div className="activity-footer">
                  <span>⏱ {a.estimatedMinutes} min</span>
                  <span>⭐ +{a.xpReward} XP</span>
                </div>

                <button
                  className="play-button"
                  onClick={() => onPlayActivity(a.type, a.id)}
                >
                  {a.completed ? 'Play Again' : 'Play Game'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activities;