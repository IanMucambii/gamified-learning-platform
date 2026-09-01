import './App.css'

type PatientStatus = 'Active' | 'At risk' | 'Inactive'

type Patient = {
  id: number
  name: string
  age: number
  room: string
  status: PatientStatus
  progress: number
  score: number
  completedActivities: number
  totalActivities: number
  lastActivity: string
  nextSession: string
  alert?: string
  avatar: string
  recentGames: { name: string; score: number; time: string }[]
}

const patients: Patient[] = [
  {
    id: 1,
    name: 'Maria Silva',
    age: 72,
    room: 'Room 12',
    status: 'Active',
    progress: 86,
    score: 92,
    completedActivities: 18,
    totalActivities: 20,
    lastActivity: 'Music memory game • 10 minutes ago',
    nextSession: 'Today • 2:00 PM',
    avatar: 'M',
    recentGames: [
      { name: 'Memory Match', score: 95, time: '10 min ago' },
      { name: 'Family Photos', score: 88, time: 'Yesterday' },
      { name: 'Music Recall', score: 91, time: '2 days ago' },
    ],
  },
  {
    id: 2,
    name: 'João Pereira',
    age: 68,
    room: 'Room 08',
    status: 'At risk',
    progress: 61,
    score: 74,
    completedActivities: 11,
    totalActivities: 18,
    lastActivity: 'Puzzle session • 1 hour ago',
    nextSession: 'Today • 3:30 PM',
    alert: 'Missed last two sessions',
    avatar: 'J',
    recentGames: [
      { name: 'Puzzle Match', score: 72, time: '1 hour ago' },
      { name: 'Numbers Recall', score: 68, time: 'Yesterday' },
      { name: 'Object Sorting', score: 81, time: '3 days ago' },
    ],
  },
  {
    id: 3,
    name: 'António Costa',
    age: 76,
    room: 'Room 05',
    status: 'Inactive',
    progress: 34,
    score: 52,
    completedActivities: 6,
    totalActivities: 18,
    lastActivity: 'No recent activity',
    nextSession: 'Tomorrow • 11:00 AM',
    alert: 'No activity in 4 days',
    avatar: 'A',
    recentGames: [
      { name: 'Photo Recall', score: 58, time: '4 days ago' },
      { name: 'Music Listening', score: 47, time: '5 days ago' },
      { name: 'Simple Quiz', score: 50, time: '6 days ago' },
    ],
  },
  {
    id: 4,
    name: 'Helena Santos',
    age: 70,
    room: 'Room 17',
    status: 'Active',
    progress: 91,
    score: 96,
    completedActivities: 19,
    totalActivities: 21,
    lastActivity: 'Reminiscence cards • 20 minutes ago',
    nextSession: 'Today • 1:15 PM',
    avatar: 'H',
    recentGames: [
      { name: 'Memory Match', score: 98, time: '20 min ago' },
      { name: 'Family Stories', score: 94, time: 'Yesterday' },
      { name: 'Photo Recall', score: 97, time: '2 days ago' },
    ],
  },
]

const summaryCards = [
  { label: 'Assigned Patients', value: '24', icon: '👥', change: '+3 this week' },
  { label: 'Completed Today', value: '18', icon: '✅', change: '+5 vs yesterday' },
  { label: 'Average Score', value: '82%', icon: '⭐', change: '+6% this month' },
  { label: 'Needs Attention', value: '4', icon: '⚠', change: '2 at risk' },
]

const dailyHighlights = [
  { title: 'Morning check-in', detail: '4 patients completed their planned routines', tone: 'green' },
  { title: 'Follow-up needed', detail: 'João Pereira missed his last two sessions', tone: 'orange' },
  { title: 'Inactive alert', detail: 'António Costa has not engaged in 4 days', tone: 'red' },
]

const recentActivity = [
  { patient: 'Maria Silva', action: 'Completed Music Memory', time: '10 minutes ago', score: '95%' },
  { patient: 'Helena Santos', action: 'Completed Family Stories', time: '32 minutes ago', score: '94%' },
  { patient: 'João Pereira', action: 'Finished Puzzle Match', time: '1 hour ago', score: '72%' },
  { patient: 'António Costa', action: 'No activity recorded', time: '4 days ago', score: '—' },
]

const getStatusClass = (status: PatientStatus) => {
  if (status === 'Active') return 'status status-active'
  if (status === 'At risk') return 'status status-warning'
  return 'status status-inactive'
}

function App() {
  return (
    <div className="caregiver-shell">
      <header className="caregiver-header">
        <div>
          <p className="eyebrow">Caregiver Overview</p>
          <h1>Caregiver Dashboard</h1>
        </div>

        <div className="header-actions">
          <button className="ghost-button" type="button">
            Schedule
          </button>
          <button className="primary-button" type="button">
            + New Check-in
          </button>
        </div>
      </header>

      <main className="caregiver-page">
        <section className="stats-grid" aria-label="Caregiver summary statistics">
          {summaryCards.map((card) => (
            <article key={card.label} className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon">{card.icon}</div>
              </div>
              <p>{card.label}</p>
              <div className="stat-value">
                <h2>{card.value}</h2>
              </div>
              <span className="stat-change">{card.change}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card large-card">
            <div className="card-header">
              <div>
                <h3>Assigned Patients</h3>
                <span>Overview of current care plan</span>
              </div>
              <button type="button">View all</button>
            </div>

            <div className="patient-list">
              {patients.map((patient) => (
                <div key={patient.id} className="patient-row">
                  <div className="patient-meta">
                    <div className="patient-avatar">{patient.avatar}</div>
                    <div>
                      <strong>{patient.name}</strong>
                      <span>
                        {patient.age} years • {patient.room}
                      </span>
                    </div>
                  </div>

                  <div className="patient-progress">
                    <div className="progress-header">
                      <span>Progress</span>
                      <strong>{patient.progress}%</strong>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: `${patient.progress}%` }} />
                    </div>
                  </div>

                  <div className="patient-score">
                    <span>Score</span>
                    <strong>{patient.score}%</strong>
                  </div>

                  <span className={getStatusClass(patient.status)}>{patient.status}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Patient Watchlist</h3>
                <span>Needs follow-up</span>
              </div>
            </div>

            <div className="alert-list">
              {dailyHighlights.map((item) => (
                <div key={item.title} className={`alert-item alert-${item.tone}`}>
                  <span className="alert-dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Patient Progress</h3>
                <span>Session performance</span>
              </div>
            </div>

            <div className="progress-panel">
              {patients.map((patient) => (
                <div key={`${patient.id}-progress`} className="mini-progress-card">
                  <div className="mini-progress-header">
                    <strong>{patient.name}</strong>
                    <span className={getStatusClass(patient.status)}>{patient.status}</span>
                  </div>

                  <div className="mini-progress-row">
                    <span>Completed</span>
                    <strong>
                      {patient.completedActivities}/{patient.totalActivities}
                    </strong>
                  </div>

                  <div className="progress-bar compact">
                    <span style={{ width: `${patient.progress}%` }} />
                  </div>

                  <div className="mini-progress-row secondary">
                    <span>Last activity</span>
                    <strong>{patient.lastActivity.split('•')[0].trim()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Recent Activity</h3>
                <span>Latest engagement</span>
              </div>
            </div>

            <div className="activity-feed">
              {recentActivity.map((entry) => (
                <div className="activity-item" key={`${entry.patient}-${entry.time}`}>
                  <div className="activity-icon">●</div>
                  <div>
                    <strong>{entry.patient}</strong>
                    <p>{entry.action}</p>
                  </div>
                  <div className="activity-meta">
                    <span>{entry.score}</span>
                    <small>{entry.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Care Plans</h3>
                <span>Today's planned support</span>
              </div>
            </div>

            <div className="plan-list">
              {patients.map((patient) => (
                <div className="plan-item" key={`${patient.id}-plan`}>
                  <div>
                    <strong>{patient.name}</strong>
                    <p>{patient.nextSession}</p>
                  </div>
                  <div className="plan-right">
                    <span>{patient.completedActivities} activities</span>
                    <button type="button">Open</button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Recent Games</h3>
                <span>Performance snapshot</span>
              </div>
            </div>

            <div className="games-summary">
              {patients.slice(0, 3).map((patient) => (
                <div key={`${patient.id}-games`} className="game-row">
                  <div className="game-name">
                    <strong>{patient.name}</strong>
                    <small>{patient.recentGames[0].name}</small>
                  </div>
                  <div className="game-score">
                    <span>{patient.recentGames[0].score}%</span>
                    <small>{patient.recentGames[0].time}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
