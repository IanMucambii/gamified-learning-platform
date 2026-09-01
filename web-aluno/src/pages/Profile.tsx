import { useEffect, useState } from "react";

interface Caregiver {
  _id: string;
  name: string;
  email: string;
}

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  role: string;
  supervisor: Caregiver | null;
  createdAt: string;
}

function formatMemberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data: ProfileData = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="profile-page">Loading...</div>;
  if (error || !profile) return <div className="profile-page">Couldn't load profile.</div>;

  return (
    <div className="profile-page">

      {/* Page Header */}
      <div className="page-title">
        <h2>My Profile 👤</h2>
        <p>View your personal information and account details.</p>
      </div>

      {/* Profile Card */}
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

        {/* Personal Information */}
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

        {/* Account Information */}
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

        {/* Statistics — still mocked, pending stats controller code */}
        <div className="profile-section">
          <h3>My Statistics</h3>
          <div className="profile-statistics">
            <div><span>Total XP</span><strong>1,240</strong></div>
            <div><span>Activities</span><strong>24</strong></div>
            <div><span>Achievements</span><strong>8</strong></div>
            <div><span>Current Streak</span><strong>5 days</strong></div>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Profile;