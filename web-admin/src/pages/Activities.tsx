import React, { useState } from "react";

interface Activity {
  id: number;
  name: string;
  type: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  completions: number;
  status: "Active" | "Inactive";
}

const Activities: React.FC = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const [selectedActivity, setSelectedActivity] =
    useState<Activity | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add activity form

  const [newActivity, setNewActivity] = useState({
    name: "",
    type: "",
    difficulty: "Easy" as Activity["difficulty"],
    duration: 5,
  });

  // Edit activity form

  const [editActivity, setEditActivity] = useState({
    id: 0,
    name: "",
    type: "",
    difficulty: "Easy" as Activity["difficulty"],
    duration: 5,
  });

  // ==========================================
  // ACTIVITY DATA
  // ==========================================

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      name: "Memory Match",
      type: "Memory",
      difficulty: "Easy",
      duration: 5,
      completions: 128,
      status: "Active",
    },
    {
      id: 2,
      name: "Word Recall",
      type: "Cognitive",
      difficulty: "Medium",
      duration: 10,
      completions: 96,
      status: "Active",
    },
    {
      id: 3,
      name: "Picture Recognition",
      type: "Recognition",
      difficulty: "Easy",
      duration: 5,
      completions: 143,
      status: "Active",
    },
    {
      id: 4,
      name: "Pattern Match",
      type: "Logic",
      difficulty: "Medium",
      duration: 8,
      completions: 74,
      status: "Active",
    },
    {
      id: 5,
      name: "Number Sequence",
      type: "Logic",
      difficulty: "Hard",
      duration: 10,
      completions: 41,
      status: "Inactive",
    },
  ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredActivities = activities.filter((activity) => {
    const search = searchTerm.toLowerCase();

    return (
      activity.name.toLowerCase().includes(search) ||
      activity.type.toLowerCase().includes(search) ||
      activity.difficulty.toLowerCase().includes(search)
    );
  });

  // ==========================================
  // ADD ACTIVITY
  // ==========================================

  const handleAddActivity = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newActivity.name || !newActivity.type) {
      return;
    }

    const activity: Activity = {
      id: Date.now(),
      name: newActivity.name,
      type: newActivity.type,
      difficulty: newActivity.difficulty,
      duration: newActivity.duration,
      completions: 0,
      status: "Active",
    };

    setActivities((currentActivities) => [
      ...currentActivities,
      activity,
    ]);

    setNewActivity({
      name: "",
      type: "",
      difficulty: "Easy",
      duration: 5,
    });

    setIsModalOpen(false);
  };

  // ==========================================
  // VIEW ACTIVITY
  // ==========================================

  const handleViewActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleOpenEdit = (activity: Activity) => {
    setEditActivity({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      difficulty: activity.difficulty,
      duration: activity.duration,
    });

    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  // ==========================================
  // SAVE EDIT
  // ==========================================

  const handleEditActivity = (event: React.FormEvent) => {
    event.preventDefault();

    if (!editActivity.name || !editActivity.type) {
      return;
    }

    setActivities((currentActivities) =>
      currentActivities.map((activity) =>
        activity.id === editActivity.id
          ? {
              ...activity,
              name: editActivity.name,
              type: editActivity.type,
              difficulty: editActivity.difficulty,
              duration: editActivity.duration,
            }
          : activity
      )
    );

    setIsEditModalOpen(false);
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  const handleToggleStatus = (activityId: number) => {
    setActivities((currentActivities) =>
      currentActivities.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              status:
                activity.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : activity
      )
    );

    setActiveMenu(null);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="patients-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="page-toolbar">

        <div>
          <h2>Activities & Games</h2>

          <p>
            Manage cognitive activities and games for patients.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Activity
        </button>

      </div>


      {/* ======================================
          ACTIVITIES TABLE
      ====================================== */}

      <div className="patients-card">

        <div className="patients-card-header">

          <div>

            <h3>Activities</h3>

            <span>
              {filteredActivities.length} activities
            </span>

          </div>

          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
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
                <th>Completions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredActivities.map((activity) => (

                <tr key={activity.id}>

                  {/* Activity */}

                  <td>

                    <div className="patient-info">

                      <div className="table-avatar">
                        {activity.name.charAt(0)}
                      </div>

                      <strong>
                        {activity.name}
                      </strong>

                    </div>

                  </td>


                  {/* Type */}

                  <td>
                    {activity.type}
                  </td>


                  {/* Difficulty */}

                  <td>
                    {activity.difficulty}
                  </td>


                  {/* Duration */}

                  <td>
                    {activity.duration} min
                  </td>


                  {/* Completions */}

                  <td>
                    {activity.completions}
                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={`table-status ${
                        activity.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {activity.status}
                    </span>

                  </td>


                  {/* Action */}

                  <td>

                    <div className="action-menu-container">

                      <button
                        className="action-button"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === activity.id
                              ? null
                              : activity.id
                          )
                        }
                      >
                        ⋮
                      </button>


                      {activeMenu === activity.id && (

                        <div className="action-menu">

                          <button
                            onClick={() =>
                              handleViewActivity(activity)
                            }
                          >
                            👁 View
                          </button>


                          <button
                            onClick={() =>
                              handleOpenEdit(activity)
                            }
                          >
                            ✏ Edit
                          </button>


                          <button
                            onClick={() =>
                              handleToggleStatus(activity.id)
                            }
                          >
                            {activity.status === "Active"
                              ? "⏸ Deactivate"
                              : "▶ Activate"}
                          </button>

                        </div>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {filteredActivities.length === 0 && (

            <div className="empty-state">
              No activities found.
            </div>

          )}

        </div>

      </div>


      {/* ======================================
          ADD ACTIVITY MODAL
      ====================================== */}

      {isModalOpen && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h3>
                  Add New Activity
                </h3>

                <p>
                  Create a new activity for patients.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setIsModalOpen(false)
                }
              >
                ×
              </button>

            </div>


            <form onSubmit={handleAddActivity}>

              {/* Name */}

              <div className="form-group">

                <label>
                  Activity Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Memory Match"
                  value={newActivity.name}
                  onChange={(event) =>
                    setNewActivity({
                      ...newActivity,
                      name: event.target.value,
                    })
                  }
                />

              </div>


              {/* Type */}

              <div className="form-group">

                <label>
                  Activity Type
                </label>

                <select
                  value={newActivity.type}
                  onChange={(event) =>
                    setNewActivity({
                      ...newActivity,
                      type: event.target.value,
                    })
                  }
                >
                  <option value="">
                    Select type
                  </option>

                  <option value="Memory">
                    Memory
                  </option>

                  <option value="Cognitive">
                    Cognitive
                  </option>

                  <option value="Recognition">
                    Recognition
                  </option>

                  <option value="Logic">
                    Logic
                  </option>

                  <option value="Language">
                    Language
                  </option>
                </select>

              </div>


              {/* Difficulty */}

              <div className="form-group">

                <label>
                  Difficulty
                </label>

                <select
                  value={newActivity.difficulty}
                  onChange={(event) =>
                    setNewActivity({
                      ...newActivity,
                      difficulty:
                        event.target
                          .value as Activity["difficulty"],
                    })
                  }
                >
                  <option value="Easy">
                    Easy
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Hard">
                    Hard
                  </option>

                </select>

              </div>


              {/* Duration */}

              <div className="form-group">

                <label>
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  min="1"
                  value={newActivity.duration}
                  onChange={(event) =>
                    setNewActivity({
                      ...newActivity,
                      duration:
                        Number(event.target.value),
                    })
                  }
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Add Activity
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ======================================
          VIEW ACTIVITY MODAL
      ====================================== */}

      {isViewModalOpen && selectedActivity && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h3>
                  Activity Details
                </h3>

                <p>
                  Information about this activity.
                </p>

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

              <div className="profile-avatar">
                {selectedActivity.name.charAt(0)}
              </div>

              <div>

                <h2>
                  {selectedActivity.name}
                </h2>

                <p>
                  {selectedActivity.type}
                </p>

                <span
                  className={`table-status ${
                    selectedActivity.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {selectedActivity.status}
                </span>

              </div>

            </div>


            <div className="profile-info">

              <div className="profile-info-item">

                <span>
                  Type
                </span>

                <strong>
                  {selectedActivity.type}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Difficulty
                </span>

                <strong>
                  {selectedActivity.difficulty}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Duration
                </span>

                <strong>
                  {selectedActivity.duration} minutes
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Total Completions
                </span>

                <strong>
                  {selectedActivity.completions}
                </strong>

              </div>

            </div>


            <div className="recent-activities">

              <h4>
                Activity Description
              </h4>

              <p>
                This cognitive activity is designed to
                provide patients with an engaging mental
                exercise while allowing caregivers to
                monitor participation and progress.
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ======================================
          EDIT ACTIVITY MODAL
      ====================================== */}

      {isEditModalOpen && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h3>
                  Edit Activity
                </h3>

                <p>
                  Update activity information.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setIsEditModalOpen(false)
                }
              >
                ×
              </button>

            </div>


            <form onSubmit={handleEditActivity}>

              {/* Name */}

              <div className="form-group">

                <label>
                  Activity Name
                </label>

                <input
                  type="text"
                  value={editActivity.name}
                  onChange={(event) =>
                    setEditActivity({
                      ...editActivity,
                      name: event.target.value,
                    })
                  }
                />

              </div>


              {/* Type */}

              <div className="form-group">

                <label>
                  Activity Type
                </label>

                <select
                  value={editActivity.type}
                  onChange={(event) =>
                    setEditActivity({
                      ...editActivity,
                      type: event.target.value,
                    })
                  }
                >

                  <option value="Memory">
                    Memory
                  </option>

                  <option value="Cognitive">
                    Cognitive
                  </option>

                  <option value="Recognition">
                    Recognition
                  </option>

                  <option value="Logic">
                    Logic
                  </option>

                  <option value="Language">
                    Language
                  </option>

                </select>

              </div>


              {/* Difficulty */}

              <div className="form-group">

                <label>
                  Difficulty
                </label>

                <select
                  value={editActivity.difficulty}
                  onChange={(event) =>
                    setEditActivity({
                      ...editActivity,
                      difficulty:
                        event.target
                          .value as Activity["difficulty"],
                    })
                  }
                >

                  <option value="Easy">
                    Easy
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Hard">
                    Hard
                  </option>

                </select>

              </div>


              {/* Duration */}

              <div className="form-group">

                <label>
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  min="1"
                  value={editActivity.duration}
                  onChange={(event) =>
                    setEditActivity({
                      ...editActivity,
                      duration:
                        Number(event.target.value),
                    })
                  }
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setIsEditModalOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
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