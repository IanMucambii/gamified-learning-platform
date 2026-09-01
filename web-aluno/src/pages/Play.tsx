import { useEffect, useRef, useState } from "react";

type ActivityType = "quiz" | "puzzle" | "resonance";

interface PlayProps {
  type: ActivityType;
  id: string;
  onExit: () => void;
}

// ---- Quiz types ----
interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}
interface QuizData {
  _id: string;
  title: string;
  questions: QuizQuestion[];
  material?: { title: string; phrases: string[] };
}

// ---- Puzzle types ----
interface PuzzlePair {
  _id: string;
  left: string;
  right: string;
}
interface PuzzleData {
  _id: string;
  title: string;
  pairs: PuzzlePair[];
  material?: { title: string; phrases: string[] };
}

// ---- Resonance types ----
interface ResonanceImage {
  id: string;
  url: string;
  label: string;
}
interface ResonanceData {
  gameId: string;
  title: string;
  displayDurationSec: number;
  phrases: string[];
  memorize: ResonanceImage[];
  recallPool: ResonanceImage[];
}

type Phase = "loading" | "phrase" | "playing" | "memorize" | "recall" | "result" | "error";

// How long the whole phrase screen runs, split evenly across however many
// phrases the material has.
const PHRASE_SCREEN_TOTAL_MS = 15_000;

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

// Pure utility — moved outside the component so it exists before any
// effect references it, and so it isn't recreated on every render.
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function Play({ type, id, onExit }: PlayProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  // `startedAt` is only used to compute an elapsed time when submitting —
  // it never drives what's rendered, so it belongs in a ref, not state.
  // This also avoids calling the impure Date.now() during render.
  const startedAtRef = useRef<number>(0);

  // Phrase pre-activity screen state. Shared across all three activity
  // types — whichever phase should run once the phrases finish is stashed
  // in a ref so the timer effect doesn't need to know about quiz/puzzle/
  // resonance specifics.
  const [phrases, setPhrases] = useState<string[]>([]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const nextPhaseRef = useRef<Phase>("playing");

  // Quiz state
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

  // Puzzle state
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [shuffledRight, setShuffledRight] = useState<PuzzlePair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongAttempt, setWrongAttempt] = useState<string | null>(null);

  // Resonance state
  const [resonance, setResonance] = useState<ResonanceData | null>(null);
  const [memorizeIndex, setMemorizeIndex] = useState(0);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [resonanceResult, setResonanceResult] = useState<{
    correctSelections: number;
    incorrectSelections: number;
    totalTargets: number;
  } | null>(null);

  // Enters the phrase screen if there are phrases to show, otherwise jumps
  // straight to whichever phase the activity actually starts in.
  function startWithPhrases(activityPhrases: string[], activityStartPhase: Phase) {
    if (activityPhrases.length > 0) {
      setPhrases(activityPhrases);
      setPhraseIndex(0);
      nextPhaseRef.current = activityStartPhase;
      setPhase("phrase");
    } else {
      setPhase(activityStartPhase);
    }
  }

  // ---- Fetch data on mount ----
  useEffect(() => {
    // Setting a ref here does not trigger a re-render, so this is safe —
    // it's just recording "when did this run" for later use.
    startedAtRef.current = Date.now();

    async function load() {
      try {
        if (type === "quiz") {
          const res = await fetch(`/api/quizzes/${id}`, { headers: authHeaders() });
          if (!res.ok) throw new Error("Could not load quiz");
          const data: QuizData = await res.json();
          setQuiz(data);
          startWithPhrases(data.material?.phrases ?? [], "playing");
        } else if (type === "puzzle") {
          const res = await fetch(`/api/puzzles/${id}`, { headers: authHeaders() });
          if (!res.ok) throw new Error("Could not load puzzle");
          const data: PuzzleData = await res.json();
          setPuzzle(data);
          setShuffledRight(shuffleArray(data.pairs));
          startWithPhrases(data.material?.phrases ?? [], "playing");
        } else if (type === "resonance") {
          const res = await fetch(`/api/resonance/${id}/play`, { headers: authHeaders() });
          if (!res.ok) throw new Error("Could not load memory game");
          const data: ResonanceData = await res.json();
          setResonance(data);
          setMemorizeIndex(0);
          startWithPhrases(data.phrases ?? [], "memorize");
        }
      } catch (err) {
        setErrorMsg((err as Error).message);
        setPhase("error");
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id]);

  // ---- Phrase screen auto-advance ----
  useEffect(() => {
    if (phase !== "phrase") return;
    if (phrases.length === 0) {
      setPhase(nextPhaseRef.current);
      return;
    }

    const perPhraseMs = PHRASE_SCREEN_TOTAL_MS / phrases.length;
    const timer = setTimeout(() => {
      if (phraseIndex + 1 >= phrases.length) {
        setPhase(nextPhaseRef.current);
      } else {
        setPhraseIndex((i) => i + 1);
      }
    }, perPhraseMs);

    return () => clearTimeout(timer);
  }, [phase, phraseIndex, phrases]);

  // ---- Resonance memorize auto-advance ----
  useEffect(() => {
    if (phase !== "memorize" || !resonance) return;
    if (memorizeIndex >= resonance.memorize.length) return;

    // All state updates now happen inside the setTimeout callback —
    // i.e. in response to an external timer firing — instead of
    // synchronously in the effect body.
    const timer = setTimeout(() => {
      if (memorizeIndex + 1 >= resonance.memorize.length) {
        setPhase("recall");
      } else {
        setMemorizeIndex((i) => i + 1);
      }
    }, resonance.displayDurationSec * 1000);

    return () => clearTimeout(timer);
  }, [phase, memorizeIndex, resonance]);

  // ---- Quiz handlers ----
  function selectQuizAnswer(questionId: string, option: string) {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  async function submitQuiz() {
    if (!quiz) return;
    const answers = Object.entries(quizAnswers).map(([questionId, selected]) => ({
      questionId,
      selected,
    }));

    try {
      const res = await fetch(`/api/quizzes/${quiz._id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Could not submit quiz");
      const data = await res.json();
      setQuizResult({ score: data.score, total: data.total });
      setPhase("result");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setPhase("error");
    }
  }

  // ---- Puzzle handlers ----
  function handleLeftClick(pairId: string) {
    if (matchedIds.has(pairId)) return;
    setSelectedLeft(pairId);
    setWrongAttempt(null);
  }

  function handleRightClick(rightPair: PuzzlePair) {
    if (!selectedLeft || matchedIds.has(rightPair._id)) return;

    if (selectedLeft === rightPair._id) {
      setMatchedIds((prev) => new Set(prev).add(rightPair._id));
      setSelectedLeft(null);
    } else {
      setWrongAttempt(rightPair._id);
      setTimeout(() => setWrongAttempt(null), 600);
      setSelectedLeft(null);
    }
  }

  async function submitPuzzle() {
    if (!puzzle) return;
    const timeTakenSec = Math.round((Date.now() - startedAtRef.current) / 1000);

    try {
      const res = await fetch(`/api/puzzles/${puzzle._id}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          correctPairs: matchedIds.size,
          totalPairs: puzzle.pairs.length,
          timeTakenSec,
        }),
      });
      if (!res.ok) throw new Error("Could not submit puzzle");
      setPhase("result");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setPhase("error");
    }
  }

  // ---- Resonance handlers ----
  function toggleImageSelect(imageId: string) {
    setSelectedImageIds((prev) => {
      const next = new Set(prev);
      if (next.has(imageId)) next.delete(imageId);
      else next.add(imageId);
      return next;
    });
  }

  async function submitResonance() {
    if (!resonance) return;
    const timeTakenSec = Math.round((Date.now() - startedAtRef.current) / 1000);

    try {
      const res = await fetch(`/api/resonance/${resonance.gameId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          selectedIds: Array.from(selectedImageIds),
          timeTakenSec,
        }),
      });
      if (!res.ok) throw new Error("Could not submit memory game");
      const data = await res.json();
      setResonanceResult({
        correctSelections: data.correctSelections,
        incorrectSelections: data.incorrectSelections,
        totalTargets: data.totalTargets,
      });
      setPhase("result");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setPhase("error");
    }
  }

  // ---- Render ----
  if (phase === "loading") {
    return (
      <div className="play-page">
        <p>Loading activity...</p>
      </div>
    );
  }

  if (phase === "phrase") {
    return (
      <div className="play-page phrase-screen">
        <p className="phrase-text">{phrases[phraseIndex]}</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="play-page">
        <p>Something went wrong: {errorMsg}</p>
        <button className="play-button" onClick={onExit}>Back to Activities</button>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="play-page">
        <h2>Great job! 🎉</h2>

        {type === "quiz" && quizResult && (
          <p>You scored {quizResult.score} out of {quizResult.total}.</p>
        )}

        {type === "puzzle" && puzzle && (
          <p>You matched {matchedIds.size} out of {puzzle.pairs.length} pairs.</p>
        )}

        {type === "resonance" && resonanceResult && (
          <p>
            You correctly remembered {resonanceResult.correctSelections} out of{" "}
            {resonanceResult.totalTargets} images
            {resonanceResult.incorrectSelections > 0
              ? ` (${resonanceResult.incorrectSelections} incorrect picks)`
              : ""}
            .
          </p>
        )}

        <button className="play-button" onClick={onExit}>Back to Activities</button>
      </div>
    );
  }

  // ---- Quiz playing ----
  if (type === "quiz" && quiz) {
    const allAnswered = quiz.questions.every((q) => quizAnswers[q._id]);

    return (
      <div className="play-page">
        <h2>{quiz.title}</h2>

        {quiz.questions.map((q, idx) => (
          <div className="activity-card" key={q._id}>
            <p><strong>{idx + 1}. {q.question}</strong></p>

            {q.options.map((opt) => (
              <button
                key={opt}
                className="play-button"
                style={{
                  background: quizAnswers[q._id] === opt ? "#4caf50" : undefined,
                }}
                onClick={() => selectQuizAnswer(q._id, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

        <button className="play-button" disabled={!allAnswered} onClick={submitQuiz}>
          Submit Quiz
        </button>
        <button className="play-button" onClick={onExit}>Cancel</button>
      </div>
    );
  }

  // ---- Puzzle playing ----
  if (type === "puzzle" && puzzle) {
    const allMatched = matchedIds.size === puzzle.pairs.length;

    return (
      <div className="play-page">
        <h2>{puzzle.title}</h2>
        <p>Tap a word on the left, then its match on the right.</p>

        <div className="puzzle-grid" style={{ display: "flex", gap: "2rem" }}>
          <div>
            {puzzle.pairs.map((p) => (
              <button
                key={p._id}
                className="play-button"
                disabled={matchedIds.has(p._id)}
                style={{
                  background: selectedLeft === p._id ? "#2196f3" : undefined,
                  opacity: matchedIds.has(p._id) ? 0.4 : 1,
                }}
                onClick={() => handleLeftClick(p._id)}
              >
                {p.left}
              </button>
            ))}
          </div>

          <div>
            {shuffledRight.map((p) => (
              <button
                key={p._id}
                className="play-button"
                disabled={matchedIds.has(p._id)}
                style={{
                  background:
                    wrongAttempt === p._id
                      ? "#e53935"
                      : matchedIds.has(p._id)
                      ? "#4caf50"
                      : undefined,
                  opacity: matchedIds.has(p._id) ? 0.4 : 1,
                }}
                onClick={() => handleRightClick(p)}
              >
                {p.right}
              </button>
            ))}
          </div>
        </div>

        <button className="play-button" disabled={!allMatched} onClick={submitPuzzle}>
          Finish Puzzle
        </button>
        <button className="play-button" onClick={onExit}>Cancel</button>
      </div>
    );
  }

  // ---- Resonance memorize phase ----
  if (type === "resonance" && resonance && phase === "memorize") {
    const current = resonance.memorize[memorizeIndex];

    return (
      <div className="play-page">
        <h2>{resonance.title}</h2>
        <p>Memorize this — {memorizeIndex + 1} of {resonance.memorize.length}</p>

        {current && (
          <div className="activity-card">
            <img src={current.url} alt={current.label} style={{ maxWidth: "300px" }} />
            <p><strong>{current.label}</strong></p>
          </div>
        )}
      </div>
    );
  }

  // ---- Resonance recall phase ----
  if (type === "resonance" && resonance && phase === "recall") {
    return (
      <div className="play-page">
        <h2>{resonance.title}</h2>
        <p>Tap the images you saw earlier.</p>

        <div className="activities-grid">
          {resonance.recallPool.map((img) => (
            <div
              key={img.id}
              className="activity-card"
              style={{
                border: selectedImageIds.has(img.id) ? "3px solid #4caf50" : undefined,
                cursor: "pointer",
              }}
              onClick={() => toggleImageSelect(img.id)}
            >
              <img src={img.url} alt={img.label} style={{ maxWidth: "150px" }} />
              <p>{img.label}</p>
            </div>
          ))}
        </div>

        <button className="play-button" onClick={submitResonance}>
          Submit
        </button>
        <button className="play-button" onClick={onExit}>Cancel</button>
      </div>
    );
  }

  return null;
}

export default Play;