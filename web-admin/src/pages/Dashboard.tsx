import React from "react";
import StatCard from "../components/StatCard";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <section className="stats-grid">
        <StatCard
          title="Total Patients"
          value="128"
          icon="👥"
          change="+12 this month"
        />

        <StatCard
          title="Caregivers"
          value="84"
          icon="♥"
          change="+8 this month"
        />

        <StatCard
          title="Active Today"
          value="56"
          icon="●"
          change="+6 this week"
        />

        <StatCard
          title="Activities"
          value="24"
          icon="🎮"
          change="+3 this month"
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
            <div>
              <span>🧠 Memory Games</span>
              <strong>35%</strong>
            </div>

            <div>
              <span>🖼️ Reminiscence</span>
              <strong>25%</strong>
            </div>

            <div>
              <span>🎵 Music</span>
              <strong>20%</strong>
            </div>

            <div>
              <span>🧩 Puzzles</span>
              <strong>15%</strong>
            </div>
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
            <div className="patient-row">
              <div className="patient-avatar">M</div>
              <div>
                <strong>Maria Silva</strong>
                <span>Caregiver: Ana Silva</span>
              </div>
              <span className="status active-status">Active</span>
            </div>

            <div className="patient-row">
              <div className="patient-avatar">J</div>
              <div>
                <strong>João Pereira</strong>
                <span>Caregiver: Carla Pereira</span>
              </div>
              <span className="status active-status">Active</span>
            </div>

            <div className="patient-row">
              <div className="patient-avatar">A</div>
              <div>
                <strong>António Costa</strong>
                <span>Caregiver: Miguel Costa</span>
              </div>
              <span className="status inactive-status">Inactive</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button>View All</button>
          </div>

          <div className="activity-list">
            <div className="activity-row">
              <span>🧠</span>
              <div>
                <strong>Memory Match</strong>
                <p>Completed by Maria Silva</p>
              </div>
            </div>

            <div className="activity-row">
              <span>🎵</span>
              <div>
                <strong>Music Memory</strong>
                <p>Completed by João Pereira</p>
              </div>
            </div>

            <div className="activity-row">
              <span>🖼️</span>
              <div>
                <strong>Family Photos</strong>
                <p>Completed by Maria Silva</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;