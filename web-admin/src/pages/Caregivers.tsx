import React, { useEffect, useState } from "react";
import {
  getCaregiversDetailed,
  updateCaregiver,
  approveCaregiver,
  registerUser,
} from "../services/api";
import type { AdminCaregiver } from "../services/api";

const Caregivers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedCaregiver, setSelectedCaregiver] = useState<AdminCaregiver | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newCaregiver, setNewCaregiver] = useState({ name: "", email: "", password: "" });
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [editCaregiver, setEditCaregiver] = useState({ id: "", name: "", email: "" });

  const [caregivers, setCaregivers] = useState<AdminCaregiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // No setState before the first `await` — see the same note in Patients.tsx.
  const loadData = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const data = await getCaregiversDetailed(token);
      setCaregivers(data);
      setLoadError(null);
    } catch (err) {
      console.error("Failed to load caregivers:", err);
      setLoadError("Failed to load caregivers. Please try again.");
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

  const filteredCaregivers = caregivers.filter((caregiver) => {
    const search = searchTerm.toLowerCase();
    return (
      caregiver.name.toLowerCase().includes(search) ||
      caregiver.email.toLowerCase().includes(search)
    );
  });

  const handleAddCaregiver = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCaregiver.name || !newCaregiver.email || !newCaregiver.password) return;

    setIsAdding(true);
    setAddError(null);
    try {
      await registerUser({
        name: newCaregiver.name,
        email: newCaregiver.email,
        password: newCaregiver.password,
        role: "Doctor",
      });
      setNewCaregiver({ name: "", email: "", password: "" });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add caregiver.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewCaregiver = (caregiver: AdminCaregiver) => {
    setSelectedCaregiver(caregiver);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };

  const handleOpenEdit = (caregiver: AdminCaregiver) => {
    setEditCaregiver({ id: caregiver.id, name: caregiver.name, email: caregiver.email });
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleEditCaregiver = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editCaregiver.name || !editCaregiver.email) return;

    const token = localStorage.getItem("token") || "";
    try {
      await updateCaregiver(token, editCaregiver.id, {
        name: editCaregiver.name,
        email: editCaregiver.email,
      });
      setIsEditModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleApprove = async (caregiverId: string) => {
    setApprovingId(caregiverId);
    const token = localStorage.getItem("token") || "";
    try {
      await approveCaregiver(token, caregiverId);
      await loadData();
    } catch (err) {
      console.error("Failed to approve caregiver:", err);
      alert("Failed to approve caregiver. Please try again.");
    } finally {
      setApprovingId(null);
      setActiveMenu(null);
    }
  };

  if (isLoading) {
    return (
      <div className="patients-page">
        <div className="page-toolbar">
          <div>
            <h2>Caregiver Management</h2>
            <p>Manage caregivers and monitor their assigned patients.</p>
          </div>
        </div>
        <div className="patients-card">
          <div className="empty-state">Loading caregivers...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="patients-page">
        <div className="page-toolbar">
          <div>
            <h2>Caregiver Management</h2>
            <p>Manage caregivers and monitor their assigned patients.</p>
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
          <h2>Caregiver Management</h2>
          <p>Manage caregivers and monitor their assigned patients.</p>
        </div>

        <button className="primary-button" onClick={() => setIsModalOpen(true)}>
          + Add Caregiver
        </button>
      </div>

      <div className="patients-card">
        <div className="patients-card-header">
          <div>
            <h3>Caregivers</h3>
            <span>{filteredCaregivers.length} caregivers</span>
          </div>

          <input
            type="text"
            placeholder="Search caregivers..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Caregiver</th>
                <th>Email</th>
                <th>Patients</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCaregivers.map((caregiver) => (
                <tr key={caregiver.id}>
                  <td>
                    <div className="patient-info">
                      <div className="table-avatar">{caregiver.name.charAt(0)}</div>
                      <strong>{caregiver.name}</strong>
                    </div>
                  </td>

                  <td>{caregiver.email}</td>

                  <td>{caregiver.patientCount}</td>

                  <td>
                    <span
                      className={`table-status ${
                        caregiver.isApproved ? "status-active" : "status-inactive"
                      }`}
                    >
                      {caregiver.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td>
                    <div className="action-menu-container">
                      <button
                        className="action-button"
                        onClick={() =>
                          setActiveMenu(activeMenu === caregiver.id ? null : caregiver.id)
                        }
                      >
                        ⋮
                      </button>

                      {activeMenu === caregiver.id && (
                        <div className="action-menu">
                          <button onClick={() => handleViewCaregiver(caregiver)}>
                            👁 View
                          </button>
                          <button onClick={() => handleOpenEdit(caregiver)}>✏ Edit</button>
                          {!caregiver.isApproved && (
                            <button
                              onClick={() => handleApprove(caregiver.id)}
                              disabled={approvingId === caregiver.id}
                            >
                              {approvingId === caregiver.id ? "Approving..." : "✓ Approve"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCaregivers.length === 0 && (
            <div className="empty-state">No caregivers found.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>Add New Caregiver</h3>
                <p>Enter the caregiver's information.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setIsModalOpen(false);
                  setAddError(null);
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCaregiver}>
              {addError && <div className="empty-state">{addError}</div>}

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter caregiver name"
                  value={newCaregiver.name}
                  onChange={(event) =>
                    setNewCaregiver({ ...newCaregiver, name: event.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newCaregiver.email}
                  onChange={(event) =>
                    setNewCaregiver({ ...newCaregiver, email: event.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Set a temporary password"
                  value={newCaregiver.password}
                  onChange={(event) =>
                    setNewCaregiver({ ...newCaregiver, password: event.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setAddError(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add Caregiver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedCaregiver && (
        <div className="modal-overlay">
          <div className="modal patient-profile-modal">
            <div className="modal-header">
              <div>
                <h3>Caregiver Profile</h3>
                <p>Caregiver information and patient overview.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedCaregiver(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="patient-profile-header">
              <div className="profile-avatar">{selectedCaregiver.name.charAt(0)}</div>
              <div>
                <h2>{selectedCaregiver.name}</h2>
                <p>{selectedCaregiver.email}</p>
                <span
                  className={`table-status ${
                    selectedCaregiver.isApproved ? "status-active" : "status-inactive"
                  }`}
                >
                  {selectedCaregiver.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-info-item">
                <span>Assigned Patients</span>
                <strong>{selectedCaregiver.patientCount}</strong>
              </div>
            </div>

            <div className="recent-activities">
              <h4>Assigned Patients</h4>

              {selectedCaregiver.patientNames.length > 0 ? (
                selectedCaregiver.patientNames.map((name) => (
                  <div className="activity-row" key={name}>
                    <span>{name}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">No patients assigned.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>Edit Caregiver</h3>
                <p>Update the caregiver's information.</p>
              </div>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleEditCaregiver}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editCaregiver.name}
                  onChange={(event) =>
                    setEditCaregiver({ ...editCaregiver, name: event.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editCaregiver.email}
                  onChange={(event) =>
                    setEditCaregiver({ ...editCaregiver, email: event.target.value })
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

export default Caregivers;