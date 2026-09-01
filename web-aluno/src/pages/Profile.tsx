import { useEffect, useState } from "react";
import { getMe, getMyStats } from "../services/api";
import type { MeResponse, OverallStats } from "../services/api";
function formatMemberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function Profile() {
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

  if (loading) return <div className="profile-page">Loading...</div>;
  if (error || !profile) return <div className="profile-page">Couldn't load profile.</div>;

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
            <div><span>Total XP</span><strong>{stats?.totalXp.toLocaleString() ?? 0}</strong></div>
            <div><span>Activities</span><strong>{stats?.activitiesCompleted ?? 0}</strong></div>
            <div><span>Achievements</span><strong>—</strong></div>
            <div><span>Current Streak</span><strong>{stats?.currentStreak ?? 0} days</strong></div>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Profile;