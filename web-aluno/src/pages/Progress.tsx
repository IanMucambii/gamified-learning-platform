function Progress() {
  const activities = [
    {
      name: "Memory Match",
      icon: "🧠",
      completed: 12,
      score: 86,
    },
    {
      name: "Picture Recognition",
      icon: "🖼️",
      completed: 8,
      score: 91,
    },
    {
      name: "Word Recall",
      icon: "💭",
      completed: 4,
      score: 72,
    },
  ];

  return (
    <div className="progress-page">

      {/* Page Header */}
      <div className="page-title">
        <h2>My Progress 📊</h2>
        <p>
          See how you are doing and keep working toward your goals.
        </p>
      </div>


      {/* Overall Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">🎮</div>

          <div>
            <span>Activities Completed</span>
            <h2>24</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">⭐</div>

          <div>
            <span>Total XP</span>
            <h2>1,240</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">📈</div>

          <div>
            <span>Average Score</span>
            <h2>83%</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">🔥</div>

          <div>
            <span>Current Streak</span>
            <h2>5 Days</h2>
          </div>
        </div>

      </div>


      {/* Weekly Goal */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2>Weekly Goal 🎯</h2>
            <p>Keep completing activities this week.</p>
          </div>
        </div>


        <div className="progress-card">

          <div className="progress-info">

            <div>
              <strong>Activities</strong>

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


      {/* Activity Performance */}
      <section className="section">

        <div className="section-header">

          <div>
            <h2>Activity Performance</h2>

            <p>
              Your performance in each activity.
            </p>
          </div>

        </div>


        <div className="performance-list">

          {activities.map((activity) => (

            <div
              className="performance-card"
              key={activity.name}
            >

              <div className="performance-icon">
                {activity.icon}
              </div>


              <div className="performance-content">

                <div className="performance-header">

                  <strong>
                    {activity.name}
                  </strong>

                  <span>
                    {activity.score}%
                  </span>

                </div>


                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${activity.score}%`,
                    }}
                  ></div>

                </div>


                <span className="performance-completed">
                  {activity.completed} activities completed
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Encouragement */}
      <section className="encouragement-card">

        <div className="encouragement-icon">
          🌟
        </div>

        <div>

          <h3>Great job, Maria!</h3>

          <p>
            You are making good progress. Keep completing
            your activities and reach your weekly goal!
          </p>

        </div>

      </section>

    </div>
  );
}

export default Progress;