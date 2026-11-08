import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";

interface ActivityCategory {
  key: string;
  label: string;
  icon: string;
  percent: number;
}

interface RecentPatient {
  id: string;
  name: string;
  caregiverName: string | null;
}

interface RecentActivity {
  id: string;
  icon: string;
  title: string;
  patientName: string;
  createdAt: string;
}

interface AdminDashboardData {
  totalPatients: number;
  newPatientsThisMonth: number;
  totalCaregivers: number;
  newCaregiversThisMonth: number;
  totalActivities: number;
  newActivitiesThisMonth: number;
  activityCategories: ActivityCategory[];
  recentPatients: RecentPatient[];
  recentActivities: RecentActivity[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  }, []);

  console.log("Dashboard data:", data);

  if (error) return <div className="dashboard">Couldn't load dashboard.</div>;
  if (!data) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <section className="stats-grid">
        <StatCard
          title="Total Patients"
          value={String(data.totalPatients)}
          icon="👥"
          change={`+${data.newPatientsThisMonth} this month`}
        />

        <StatCard
          title="Caregivers"
          value={String(data.totalCaregivers)}
          icon="♥"
          change={`+${data.newCaregiversThisMonth} this month`}
        />

        <StatCard
          title="Activities"
          value={String(data.totalActivities)}
          icon="🎮"
          change={`+${data.newActivitiesThisMonth} this month`}
        />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card large-card">
          <div className="card-header">
            <h3>Platform Overview</h3>
            <select>
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="chart-placeholder">
            <span>Activity Overview Chart</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Activity Categories</h3>
          </div>

          <div className="category-list">
            {data.activityCategories.length === 0 ? (
              <p className="empty-note">No activity yet.</p>
            ) : (
              data.activityCategories.map((cat) => (
                <div key={cat.key}>
                  <span>{cat.icon} {cat.label}</span>
                  <strong>{cat.percent}%</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Patients</h3>
            <button>View All</button>
          </div>

          <div className="patient-list">
            {data.recentPatients.length === 0 ? (
              <p className="empty-note">No patients yet.</p>
            ) : (
              data.recentPatients.map((p) => (
                <div className="patient-row" key={p.id}>
                  <div className="patient-avatar">{p.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{p.name}</strong>
                    <span>Caregiver: {p.caregiverName ?? "Not assigned"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button>View All</button>
          </div>

          <div className="activity-list">
            {data.recentActivities.length === 0 ? (
              <p className="empty-note">No activity yet.</p>
            ) : (
              data.recentActivities.map((a) => (
                <div className="activity-row" key={a.id}>
                  <span>{a.icon}</span>
                  <div>
                    <strong>{a.title}</strong>
                    <p>Completed by {a.patientName}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;