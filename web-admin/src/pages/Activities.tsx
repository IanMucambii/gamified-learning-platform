import React, { useEffect, useState } from "react";
import { getActivities, updateActivity } from "../services/api";
import type { AdminActivity } from "../services/api";

const typeLabels: Record<AdminActivity["type"], string> = {
  quiz: "Quiz",
  puzzle: "Puzzle",
  resonance: "Resonance",
};

const difficultyLabels: Record<AdminActivity["difficulty"], string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const Activities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<AdminActivity | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editActivity, setEditActivity] = useState({
    id: "",
    type: "quiz" as AdminActivity["type"],
    title: "",
    difficulty: "easy" as AdminActivity["difficulty"],
    estimatedMinutes: 5,
  });

  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // No setState before the first `await` — see the same note in Patients.tsx.
  const loadData = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const data = await getActivities(token);
      setActivities(data);
      setLoadError(null);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setLoadError("Failed to load activities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line 
    loadData();
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(null);
    loadData();
  };

  const filteredActivities = activities.filter((activity) => {
    const search = searchTerm.toLowerCase();
    return (
      activity.title.toLowerCase().includes(search) ||
      typeLabels[activity.type].toLowerCase().includes(search) ||
      activity.difficulty.toLowerCase().includes(search)
    );
  });

  const handleViewActivity = (activity: AdminActivity) => {
    setSelectedActivity(activity);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };

  const handleOpenEdit = (activity: AdminActivity) => {
    setEditActivity({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      difficulty: activity.difficulty,
      estimatedMinutes: activity.estimatedMinutes,
    });
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleEditActivity = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editActivity.title) return;

    const token = localStorage.getItem("token") || "";
    try {
      await updateActivity(token, editActivity.type, editActivity.id, {
        title: editActivity.title,
        difficulty: editActivity.difficulty,
        estimatedMinutes: editActivity.estimatedMinutes,
      });
      setIsEditModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert(
        "Failed to save changes. If this keeps happening, check that the update route allows the admin role."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="patients-page">
        <div className="page-toolbar">
          <div>
            <h2>Activities & Games</h2>
            <p>Manage cognitive activities and games for patients.</p>
          </div>
        </div>
        <div className="patients-card">
          <div className="empty-state">Loading activities...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="patients-page">
        <div className="page-toolbar">
          <div>
            <h2>Activities & Games</h2>
            <p>Manage cognitive activities and games for patients.</p>
          </div>
        </div>
        <div className="patients-card">
          <div className="empty-state">
            {loadError}{" "}
            <button className="primary-button" onClick={handleRetry}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-page">
      <div className="page-toolbar">
        <div>
          <h2>Activities & Games</h2>
          <p>Manage cognitive activities and games for patients.</p>
        </div>
        {/* No "Add Activity" here — activities are generated from Material uploads, not created by hand. */}
      </div>

      <div className="patients-card">
        <div className="patients-card-header">
          <div>
            <h3>Activities</h3>
            <span>{filteredActivities.length} activities</span>
          </div>

          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>XP Reward</th>
                <th>Completions</th>
                <th>Source</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <div className="patient-info">
                      <div className="table-avatar">{activity.title.charAt(0)}</div>
                      <strong>{activity.title}</strong>
                    </div>
                  </td>

                  <td>{typeLabels[activity.type]}</td>

                  <td>{difficultyLabels[activity.difficulty]}</td>

                  <td>{activity.estimatedMinutes} min</td>

                  <td>{activity.xpReward} XP</td>

                  <td>{activity.completions}</td>

                  <td>
                    <span
                      className={`table-status ${
                        activity.generatedByAI ? "status-active" : "status-inactive"
                      }`}
                    >
                      {activity.generatedByAI ? "AI-generated" : "Manual"}
                    </span>
                  </td>

                  <td>
                    <div className="action-menu-container">
                      <button
                        className="action-button"
                        onClick={() =>
                          setActiveMenu(activeMenu === activity.id ? null : activity.id)
                        }
                      >
                        ⋮
                      </button>

                      {activeMenu === activity.id && (
                        <div className="action-menu">
                          <button onClick={() => handleViewActivity(activity)}>
                            👁 View
                          </button>
                          <button onClick={() => handleOpenEdit(activity)}>✏ Edit</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredActivities.length === 0 && (
            <div className="empty-state">No activities found.</div>
          )}
        </div>
      </div>

      {isViewModalOpen && selectedActivity && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>Activity Details</h3>
                <p>Information about this activity.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedActivity(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="patient-profile-header">
              <div className="profile-avatar">{selectedActivity.title.charAt(0)}</div>
              <div>
                <h2>{selectedActivity.title}</h2>
                <p>{typeLabels[selectedActivity.type]}</p>
                <span
                  className={`table-status ${
                    selectedActivity.generatedByAI ? "status-active" : "status-inactive"
                  }`}
                >
                  {selectedActivity.generatedByAI ? "AI-generated" : "Manual"}
                </span>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-info-item">
                <span>Difficulty</span>
                <strong>{difficultyLabels[selectedActivity.difficulty]}</strong>
              </div>

              <div className="profile-info-item">
                <span>Duration</span>
                <strong>{selectedActivity.estimatedMinutes} minutes</strong>
              </div>

              <div className="profile-info-item">
                <span>XP Reward</span>
                <strong>{selectedActivity.xpReward} XP</strong>
              </div>

              <div className="profile-info-item">
                <span>Total Completions</span>
                <strong>{selectedActivity.completions}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>Edit Activity</h3>
                <p>Update activity information.</p>
              </div>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleEditActivity}>
              <div className="form-group">
                <label>Activity Title</label>
                <input
                  type="text"
                  value={editActivity.title}
                  onChange={(event) =>
                    setEditActivity({ ...editActivity, title: event.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={editActivity.difficulty}
                  onChange={(event) =>
                    setEditActivity({
                      ...editActivity,
                      difficulty: event.target.value as AdminActivity["difficulty"],
                    })
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={editActivity.estimatedMinutes}
                  onChange={(event) =>
                    setEditActivity({
                      ...editActivity,
                      estimatedMinutes: Number(event.target.value),
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;