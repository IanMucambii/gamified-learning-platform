import React from "react";

interface PatientReport {
  id: number;
  name: string;
  activities: number;
  averageScore: number;
  xp: number;
  lastActive: string;
  status: "Active" | "Inactive";
}

const Reports: React.FC = () => {
  const patientReports: PatientReport[] = [
    {
      id: 1,
      name: "Maria Silva",
      activities: 24,
      averageScore: 86,
      xp: 1240,
      lastActive: "Today",
      status: "Active",
    },
    {
      id: 2,
      name: "João Costa",
      activities: 18,
      averageScore: 74,
      xp: 920,
      lastActive: "Today",
      status: "Active",
    },
    {
      id: 3,
      name: "Ana Pereira",
      activities: 31,
      averageScore: 91,
      xp: 1580,
      lastActive: "Yesterday",
      status: "Active",
    },
    {
      id: 4,
      name: "Carlos Mendes",
      activities: 9,
      averageScore: 62,
      xp: 480,
      lastActive: "5 days ago",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Rita Santos",
      activities: 21,
      averageScore: 79,
      xp: 1100,
      lastActive: "Today",
      status: "Active",
    },
  ];

  return (
    <div className="patients-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="page-toolbar">

        <div>
          <h2>Reports & Analytics</h2>

          <p>
            Monitor patient engagement, activity and progress.
          </p>
        </div>

      </div>


      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-icon">🎮</div>

          <div>
            <span>Total Activities</span>
            <h3>203</h3>
            <small>Completed by patients</small>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-card-icon">📈</div>

          <div>
            <span>Average Score</span>
            <h3>78%</h3>
            <small>Across all activities</small>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-card-icon">⭐</div>

          <div>
            <span>Total XP Earned</span>
            <h3>5,320</h3>
            <small>From completed activities</small>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-card-icon">👥</div>

          <div>
            <span>Active Patients</span>
            <h3>24</h3>
            <small>Active in the last 7 days</small>
          </div>
        </div>

      </div>


      {/* ======================================
          ACTIVITY OVERVIEW
      ====================================== */}

      <div className="reports-grid">

        <div className="patients-card">

          <div className="patients-card-header">

            <div>
              <h3>Patient Engagement</h3>

              <span>
                Activity completion over time
              </span>
            </div>

          </div>


          <div className="chart-placeholder">

            <div className="chart-bars">

              <div className="chart-column">
                <div
                  className="chart-bar"
                  style={{ height: "45%" }}
                ></div>
                <span>Mon</span>
              </div>

              <div className="chart-column">
                <div
                  className="chart-bar"
                  style={{ height: "65%" }}
                ></div>
                <span>Tue</span>
              </div>

              <div className="chart-column">
                <div
                  className="chart-bar"
                  style={{ height: "55%" }}
                ></div>
                <span>Wed</span>
              </div>

              <div className="chart-column">
                <div
                  className="chart-bar"
                  style={{ height: "80%" }}
                ></div>
                <span>Thu</span>
              </div>

              <div className="chart-column">
                <div
                  className="chart-bar"
                  style={{ height: "70%" }}
                ></div>
                <span>Fri</span>
              </div>

              <div className="chart-column">
                <div
                  className="chart-bar"
                  style={{ height: "90%" }}
                ></div>
                <span>Sat</span>
              </div>

              <div className="chart-column">
                <div
                  className="chart-bar"
                  style={{ height: "75%" }}
                ></div>
                <span>Sun</span>
              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            ACTIVITY PERFORMANCE
        ====================================== */}

        <div className="patients-card">

          <div className="patients-card-header">

            <div>
              <h3>Activity Performance</h3>

              <span>
                Most completed activities
              </span>
            </div>

          </div>


          <div className="activity-performance">

            <div className="performance-item">

              <div className="performance-info">
                <strong>Memory Match</strong>
                <span>92 completions</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "92%" }}
                ></div>
              </div>

            </div>


            <div className="performance-item">

              <div className="performance-info">
                <strong>Picture Recognition</strong>
                <span>81 completions</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "81%" }}
                ></div>
              </div>

            </div>


            <div className="performance-item">

              <div className="performance-info">
                <strong>Word Recall</strong>
                <span>68 completions</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "68%" }}
                ></div>
              </div>

            </div>


            <div className="performance-item">

              <div className="performance-info">
                <strong>Pattern Match</strong>
                <span>54 completions</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "54%" }}
                ></div>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          PATIENT PERFORMANCE
      ====================================== */}

      <div className="patients-card">

        <div className="patients-card-header">

          <div>
            <h3>Patient Performance</h3>

            <span>
              Individual patient activity and progress
            </span>
          </div>

        </div>


        <div className="table-container">

          <table className="patients-table">

            <thead>

              <tr>
                <th>Patient</th>
                <th>Activities</th>
                <th>Average Score</th>
                <th>XP Earned</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              {patientReports.map((patient) => (

                <tr key={patient.id}>

                  <td>

                    <div className="patient-info">

                      <div className="table-avatar">
                        {patient.name.charAt(0)}
                      </div>

                      <strong>
                        {patient.name}
                      </strong>

                    </div>

                  </td>


                  <td>
                    {patient.activities}
                  </td>


                  <td>
                    {patient.averageScore}%
                  </td>


                  <td>
                    {patient.xp.toLocaleString()}
                  </td>


                  <td>
                    {patient.lastActive}
                  </td>


                  <td>

                    <span
                      className={`table-status ${
                        patient.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {patient.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Reports;