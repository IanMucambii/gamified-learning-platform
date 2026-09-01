import { useEffect, useMemo, useState } from "react";
// import "./Achievements.css";

type ActivityKind = "quiz" | "puzzle" | "game";

// Defaults — override via the `apiBase` prop if your routers are mounted
// under different prefixes than these (this is the #1 cause of a 404 here:
// check your app.use('/api/...', ...) lines against what the network tab
// actually requests).
const DEFAULT_API: Record<ActivityKind, { myStats: string; leaderboard: string }> = {
  quiz: { myStats: "/api/quizzes/my-stats", leaderboard: "/api/quizzes/leaderboard" },
  puzzle: { myStats: "/api/puzzles/my-stats", leaderboard: "/api/puzzles/leaderboard" },
  game: { myStats: "/api/resonance/my-stats", leaderboard: "/api/resonance/leaderboard" },
};

// If your app already stores the JWT somewhere (localStorage, sessionStorage,
// a cookie via httpOnly session, or an auth context), this fills the gap when
// no `authToken` prop is passed in — that's what was causing the 401: the
// component had no token at all, so every request went out unauthenticated.
function resolveToken(explicit?: string): string | undefined {
  if (explicit) return explicit;
  if (typeof window === "undefined") return undefined;
  return (
    window.localStorage?.getItem("token") ??
    window.localStorage?.getItem("authToken") ??
    window.sessionStorage?.getItem("token") ??
    undefined
  );
}

const ACTIVITY_TABS: { key: ActivityKind; label: string; icon: string }[] = [
  { key: "quiz", label: "Quizzes", icon: "📝" },
  { key: "puzzle", label: "Puzzles", icon: "🧩" },
  { key: "game", label: "Resonance", icon: "🎮" },
];

interface LeaderboardRow {
  id: string;
  name: string;
  score: number;
  attempts: number | null;
}

interface AttemptRowData {
  id: string;
  title: string;
  primary: number;
  secondary: number | null;
  date?: string;
}

interface ActivityData {
  attempts: AttemptRowData[];
  leaderboard: LeaderboardRow[];
}

type StatsState = Record<ActivityKind, ActivityData>;

const EMPTY_STATE: StatsState = {
  quiz: { attempts: [], leaderboard: [] },
  puzzle: { attempts: [], leaderboard: [] },
  game: { attempts: [], leaderboard: [] },
};

async function fetchJSON<T = unknown>(url: string, token?: string): Promise<T> {
  const res = await fetch(url, {
    // include: sends cookies too, in case your app uses a session cookie
    // instead of (or alongside) a bearer token
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(`Not signed in (401) for ${url} — check that a valid auth token is available`);
    }
    if (res.status === 404) {
      throw new Error(`${url} not found (404) — check this route's mount prefix on the server`);
    }
    throw new Error(`Request to ${url} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// Normalizes whatever shape each leaderboard endpoint returns into a
// common row. Update the field names below once the real leaderboard
// payload shapes are confirmed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeLeaderboardRow(raw: any): LeaderboardRow {
  const id = raw?._id?._id ?? raw?._id ?? raw?.studentId ?? raw?.id ?? "";
  const name = raw?._id?.name ?? raw?.name ?? raw?.studentName ?? "Unknown player";
  const score = Number(
    raw?.totalCorrect ?? raw?.totalScore ?? raw?.score ?? raw?.points ?? 0
  );
  const attemptsRaw = raw?.attempts ?? raw?.totalAttempts ?? raw?.count;
  const attempts = attemptsRaw != null ? Number(attemptsRaw) : null;
  return { id: String(id), name, score, attempts };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAttempt(raw: any, kind: ActivityKind): AttemptRowData {
  if (kind === "game") {
    return {
      id: raw?._id ?? crypto.randomUUID(),
      title: raw?.game?.title || "Resonance session",
      primary: Number(raw?.correctSelections ?? 0),
      secondary: raw?.incorrectSelections != null ? Number(raw.incorrectSelections) : null,
      date: raw?.createdAt,
    };
  }

   if (kind === "puzzle") {
    return {
      id: raw?._id ?? crypto.randomUUID(),
      title: raw?.puzzle?.title || "Puzzle attempt",
      primary: Number(raw?.correctPairs ?? 0),
      secondary: raw?.totalPairs != null ? Number(raw.totalPairs) : null,
      date: raw?.createdAt,
    };
  }

  // quiz
  return {
    id: raw?._id ?? crypto.randomUUID(),
    title: raw?.quiz?.title || "Quiz attempt",
    primary: Number(raw?.score ?? 0),
    secondary: raw?.total != null ? Number(raw.total) : null,
    date: raw?.createdAt,
  };
}

function StatBar({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="stat-bar">
      <span className="stat-bar-value">{value}</span>
      <span className="stat-bar-label">{label}</span>
      {sublabel ? <span className="stat-bar-sublabel">{sublabel}</span> : null}
    </div>
  );
}

function AttemptRow({ attempt, kind }: { attempt: AttemptRowData; kind: ActivityKind }) {
  return (
    <div className="ledger-row">
      <div className="ledger-row-main">
        <span className="ledger-row-title">{attempt.title}</span>
        {attempt.date ? (
          <span className="ledger-row-date">
            {new Date(attempt.date).toLocaleDateString()}
          </span>
        ) : null}
      </div>
      <div className="ledger-row-score">
        {kind === "game" ? (
          <>
            <span className="score-correct">{attempt.primary} correct</span>
            <span className="score-incorrect">{attempt.secondary ?? 0} missed</span>
          </>
        ) : (
          <span>
            {attempt.primary}
            {attempt.secondary != null ? ` / ${attempt.secondary}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}

function LeaderboardList({
  rows,
  currentUserId,
}: {
  rows: LeaderboardRow[];
  currentUserId?: string;
}) {
  if (!rows.length) {
    return <p className="empty-note">No leaderboard results yet.</p>;
  }
  return (
    <ol className="leaderboard-list">
      {rows.map((row, i) => (
        <li
          key={row.id || i}
          className={`leaderboard-row${row.id === currentUserId ? " is-you" : ""}`}
        >
          <span className="leaderboard-rank">{i + 1}</span>
          <span className="leaderboard-name">
            {row.name}
            {row.id === currentUserId ? <em> (you)</em> : null}
          </span>
          <span className="leaderboard-score">{row.score}</span>
        </li>
      ))}
    </ol>
  );
}

function ActivityPanel({
  kind,
  myAttempts,
  leaderboard,
  currentUserId,
}: {
  kind: ActivityKind;
  myAttempts: AttemptRowData[];
  leaderboard: LeaderboardRow[];
  currentUserId?: string;
}) {
  const totalAttempts = myAttempts.length;
  const totalPrimary = myAttempts.reduce((sum, a) => sum + (a.primary || 0), 0);
  const myRank = leaderboard.findIndex((row) => row.id === currentUserId);

  return (
    <div className="activity-panel">
      <div className="activity-summary">
        <StatBar label="Attempts" value={totalAttempts} />
        <StatBar
          label={kind === "game" ? "Correct selections" : "Total score"}
          value={totalPrimary}
        />
        <StatBar
          label="Leaderboard rank"
          value={myRank >= 0 ? `#${myRank + 1}` : "Unranked"}
          sublabel={myRank >= 0 ? `of ${leaderboard.length}` : "Complete an activity to rank"}
        />
      </div>

      <div className="activity-columns">
        <section className="activity-column">
          <div className="section-header">
            <div>
              <h3>Your recent attempts</h3>
              <p>Personal history for this activity</p>
            </div>
          </div>
          <div className="ledger">
            {totalAttempts === 0 ? (
              <p className="empty-note">No attempts yet — go complete one!</p>
            ) : (
              myAttempts
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
                )
                .slice(0, 8)
                .map((a) => <AttemptRow key={a.id} attempt={a} kind={kind} />)
            )}
          </div>
        </section>

        <section className="activity-column">
          <div className="section-header">
            <div>
              <h3>Leaderboard</h3>
              <p>Top players across all patients</p>
            </div>
          </div>
          <LeaderboardList rows={leaderboard} currentUserId={currentUserId} />
        </section>
      </div>
    </div>
  );
}

interface AchievementsProps {
  authToken?: string;
  currentUserId?: string;
  // Override if your routers are mounted under different prefixes
  apiBase?: Partial<Record<ActivityKind, { myStats: string; leaderboard: string }>>;
}

function Achievements({ authToken, currentUserId, apiBase }: AchievementsProps) {
  const [activeTab, setActiveTab] = useState<ActivityKind>("quiz");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StatsState>(EMPTY_STATE);

  const API: Record<ActivityKind, { myStats: string; leaderboard: string }> = {
    quiz: apiBase?.quiz ?? DEFAULT_API.quiz,
    puzzle: apiBase?.puzzle ?? DEFAULT_API.puzzle,
    game: apiBase?.game ?? DEFAULT_API.game,
  };
  const token = resolveToken(authToken);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [quizStats, quizBoard, puzzleStats, puzzleBoard, gameStats, gameBoard] =
          await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchJSON<any[]>(API.quiz.myStats, token),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchJSON<any[]>(API.quiz.leaderboard, token),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchJSON<any[]>(API.puzzle.myStats, token),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchJSON<any[]>(API.puzzle.leaderboard, token),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchJSON<any[]>(API.game.myStats, token),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchJSON<any[]>(API.game.leaderboard, token),
          ]);

        if (cancelled) return;

        setData({
          quiz: {
            attempts: (quizStats ?? []).map((a) => normalizeAttempt(a, "quiz")),
            leaderboard: (quizBoard ?? []).map(normalizeLeaderboardRow),
          },
          puzzle: {
            attempts: (puzzleStats ?? []).map((a) => normalizeAttempt(a, "puzzle")),
            leaderboard: (puzzleBoard ?? []).map(normalizeLeaderboardRow),
          },
          game: {
            attempts: (gameStats ?? []).map((a) => normalizeAttempt(a, "game")),
            leaderboard: (gameBoard ?? []).map(normalizeLeaderboardRow),
          },
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, apiBase]);

  const overall = useMemo(() => {
    const kinds: ActivityKind[] = ["quiz", "puzzle", "game"];
    const totalAttempts = kinds.reduce((sum, k) => sum + data[k].attempts.length, 0);
    const totalScore = kinds.reduce(
      (sum, k) => sum + data[k].attempts.reduce((s, a) => s + (a.primary || 0), 0),
      0
    );
    return { totalAttempts, totalScore };
  }, [data]);

  if (loading) {
    return (
      <div className="achievements-page">
        <p className="empty-note">Loading your stats…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="achievements-page">
        <p className="error-note">Couldn't load stats: {error}</p>
      </div>
    );
  }

  return (
    <div className="achievements-page">
      <div className="page-title">
        <h2>Your progress</h2>
        <p>Personal results alongside how you compare with everyone else.</p>
      </div>

      <div className="achievement-summary">
        <div className="achievement-summary-card">
          <div className="summary-icon">🏆</div>
          <div>
            <span>Activities completed</span>
            <h2>{overall.totalAttempts}</h2>
          </div>
        </div>
        <div className="achievement-summary-card">
          <div className="summary-icon">⭐</div>
          <div>
            <span>Total points</span>
            <h2>{overall.totalScore.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="activity-tabs" role="tablist">
        {ACTIVITY_TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`activity-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="activity-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <ActivityPanel
        kind={activeTab}
        myAttempts={data[activeTab].attempts}
        leaderboard={data[activeTab].leaderboard}
        currentUserId={currentUserId}
      />
    </div>
  );
}

export default Achievements;