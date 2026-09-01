function Achievements() {
  const achievements = [
    {
      icon: "🧠",
      title: "Memory Starter",
      description: "Complete your first memory activity.",
      progress: "Completed",
      unlocked: true,
    },
    {
      icon: "🔥",
      title: "5 Day Streak",
      description: "Complete activities for 5 consecutive days.",
      progress: "Completed",
      unlocked: true,
    },
    {
      icon: "⭐",
      title: "XP Collector",
      description: "Earn your first 1,000 XP.",
      progress: "Completed",
      unlocked: true,
    },
    {
      icon: "🎮",
      title: "Activity Explorer",
      description: "Complete 20 activities.",
      progress: "24 / 20",
      unlocked: true,
    },
    {
      icon: "🏆",
      title: "Memory Expert",
      description: "Complete 50 memory activities.",
      progress: "12 / 50",
      unlocked: false,
    },
    {
      icon: "🌟",
      title: "Super Player",
      description: "Earn 5,000 XP.",
      progress: "1,240 / 5,000 XP",
      unlocked: false,
    },
  ];

  return (
    <div className="achievements-page">

      {/* Page Header */}
      <div className="page-title">
        <h2>Achievements 🏆</h2>

        <p>
          Keep playing and complete activities to unlock achievements.
        </p>
      </div>


      {/* Achievement Summary */}
      <div className="achievement-summary">

        <div className="achievement-summary-card">
          <div className="summary-icon">🏆</div>

          <div>
            <span>Achievements Unlocked</span>
            <h2>4 / 6</h2>
          </div>
        </div>


        <div className="achievement-summary-card">
          <div className="summary-icon">⭐</div>

          <div>
            <span>Total XP</span>
            <h2>1,240 XP</h2>
          </div>
        </div>

      </div>


      {/* Unlocked Achievements */}
      <section className="achievement-section">

        <div className="section-header">
          <div>
            <h2>Unlocked Achievements</h2>
            <p>Your accomplishments</p>
          </div>
        </div>


        <div className="achievements-grid">

          {achievements
            .filter((achievement) => achievement.unlocked)
            .map((achievement) => (

              <div
                className="achievement-card unlocked"
                key={achievement.title}
              >

                <div className="achievement-icon">
                  {achievement.icon}
                </div>

                <div className="achievement-content">

                  <span className="achievement-status">
                    ✓ Unlocked
                  </span>

                  <h3>{achievement.title}</h3>

                  <p>{achievement.description}</p>

                  <strong>{achievement.progress}</strong>

                </div>

              </div>

            ))}

        </div>

      </section>


      {/* Locked Achievements */}
      <section className="achievement-section">

        <div className="section-header">
          <div>
            <h2>Achievements to Unlock 🔒</h2>
            <p>Keep going to unlock new achievements</p>
          </div>
        </div>


        <div className="achievements-grid">

          {achievements
            .filter((achievement) => !achievement.unlocked)
            .map((achievement) => (

              <div
                className="achievement-card locked"
                key={achievement.title}
              >

                <div className="achievement-icon locked-icon">
                  🔒
                </div>

                <div className="achievement-content">

                  <span className="achievement-status locked-status">
                    Locked
                  </span>

                  <h3>{achievement.title}</h3>

                  <p>{achievement.description}</p>

                  <strong>{achievement.progress}</strong>

                </div>

              </div>

            ))}

        </div>

      </section>

    </div>
  );
}

export default Achievements;