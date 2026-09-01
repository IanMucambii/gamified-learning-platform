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

function formatMemberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function Profile() {
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

  if (loading) return <div className="profile-page">Loading...</div>;
  if (error || !profile) return <div className="profile-page">Couldn't load profile.</div>;

  const activitiesCompleted =
    quizAttempts.length + puzzleAttempts.length + resonanceAttempts.length;

  return (
    <div className="profile-page">

      <div className="page-title">
        <h2>My Profile 👤</h2>
        <p>View your personal information and account details.</p>
      </div>

      <section className="profile-card">

        <div className="profile-card-header">
          <div className="large-profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.role}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-details">
            <div className="profile-field">
              <span>Full Name</span>
              <strong>{profile.name}</strong>
            </div>
            <div className="profile-field">
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="profile-details">
            <div className="profile-field">
              <span>Member Since</span>
              <strong>{formatMemberSince(profile.createdAt)}</strong>
            </div>
            <div className="profile-field">
              <span>Caregiver</span>
              <strong>{profile.supervisor?.name ?? "Not assigned"}</strong>
            </div>
            <div className="profile-field">
              <span>Account Status</span>
              <strong className="account-active">Active</strong>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>My Statistics</h3>
          <div className="profile-statistics">
            <div><span>Activities</span><strong>{activitiesCompleted}</strong></div>
            <div><span>Quizzes</span><strong>{quizAttempts.length}</strong></div>
            <div><span>Puzzles</span><strong>{puzzleAttempts.length}</strong></div>
            <div><span>Resonance</span><strong>{resonanceAttempts.length}</strong></div>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Profile;