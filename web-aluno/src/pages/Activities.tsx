function Activities() {
  return (
    <div className="activities-page">

      <div className="page-title">
        <h2>Activities 🎮</h2>
        <p>
          Choose an activity and have fun while exercising your memory.
        </p>
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
              Memorize the position of the cards and
              find the matching pairs.
            </p>

            <div className="activity-footer">
              <span>⏱ 5 min</span>
              <span>⭐ +50 XP</span>
            </div>

            <button className="play-button">
              Play Game
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
              Play Game
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
              Play Game
            </button>

          </div>

        </div>


        {/* Pattern Match */}
        <div className="activity-card">

          <div className="activity-icon">
            🔷
          </div>

          <div className="activity-content">

            <span className="difficulty medium">
              Medium
            </span>

            <h3>Pattern Match</h3>

            <p>
              Find the missing piece in the pattern.
            </p>

            <div className="activity-footer">
              <span>⏱ 7 min</span>
              <span>⭐ +60 XP</span>
            </div>

            <button className="play-button">
              Play Game
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Activities;