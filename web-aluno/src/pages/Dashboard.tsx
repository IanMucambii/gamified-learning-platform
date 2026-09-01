function Dashboard() {
  return (
    <>
      {/* Welcome */}
      <section className="welcome-section">
        <div>
          <h2>Good morning, Maria! 👋</h2>
          <p>Ready for today's activities?</p>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div>
            <span>Total XP</span>
            <h2>1,240</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div>
            <span>Day Streak</span>
            <h2>5 Days</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div>
            <span>Achievements</span>
            <h2>8</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div>
            <span>Activities Done</span>
            <h2>24</h2>
          </div>
        </div>

      </section>

      {/* Today's Activities */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2>Today's Activities</h2>
            <p>Choose an activity to get started</p>
          </div>
        </div>

        <div className="activities-grid">

          {/* Memory Match */}
          <div className="activity-card">

            <div className="activity-icon">
              🧠
            </div>

            <div className="activity-content">

              <span className="difficulty easy">
                Easy
              </span>

              <h3>Memory Match</h3>

              <p>
                Remember the position of the cards
                and find the matching pairs.
              </p>

              <div className="activity-footer">
                <span>⏱ 5 min</span>
                <span>⭐ +50 XP</span>
              </div>

              <button className="play-button">
                Play
              </button>

            </div>

          </div>


          {/* Picture Recognition */}
          <div className="activity-card">

            <div className="activity-icon">
              🖼️
            </div>

            <div className="activity-content">

              <span className="difficulty easy">
                Easy
              </span>

              <h3>Picture Recognition</h3>

              <p>
                Identify familiar objects and pictures.
              </p>

              <div className="activity-footer">
                <span>⏱ 5 min</span>
                <span>⭐ +40 XP</span>
              </div>

              <button className="play-button">
                Play
              </button>

            </div>

          </div>


          {/* Word Recall */}
          <div className="activity-card">

            <div className="activity-icon">
              💭
            </div>

            <div className="activity-content">

              <span className="difficulty medium">
                Medium
              </span>

              <h3>Word Recall</h3>

              <p>
                Remember and select the correct words.
              </p>

              <div className="activity-footer">
                <span>⏱ 7 min</span>
                <span>⭐ +60 XP</span>
              </div>

              <button className="play-button">
                Play
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* Progress */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2>Your Progress</h2>
            <p>Keep going, you're doing great!</p>
          </div>
        </div>

        <div className="progress-card">

          <div className="progress-info">

            <div>
              <strong>Weekly Goal</strong>
              <span>
                4 of 5 activities completed
              </span>
            </div>

            <strong>80%</strong>

          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: "80%" }}
            ></div>
          </div>

        </div>

      </section>
    </>
  );
}

export default Dashboard;