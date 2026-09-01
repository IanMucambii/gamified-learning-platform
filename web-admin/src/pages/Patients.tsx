import React, { useEffect, useState } from "react";
import { getPatients, getCaregivers, updatePatient } from "../services/api";
import type { AdminPatient, Caregiver } from "../services/api";

const formatLastActive = (iso: string | null): string => {
  if (!iso) return "Never";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<AdminPatient | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editPatient, setEditPatient] = useState({
    id: "",
    name: "",
    caregiver: "", // caregiver id, "" = unassigned
  });

  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // No setState calls before the first `await` here — the effect below just
  // fires this off; isLoading/loadError already start at their "loading" values,
  // and updates that happen after the await are fine (they're no longer
  // synchronous within the effect body).
  const loadData = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const [patientsData, caregiversData] = await Promise.all([
        getPatients(token),
        getCaregivers(token),
      ]);
      setPatients(patientsData);
      setCaregivers(caregiversData);
      setLoadError(null);
    } catch (err) {
      console.error("Error loading patients or caregivers:", err);
      setLoadError("Failed to load patients. Please try again.");
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

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPatient = (patient: AdminPatient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };

  const handleOpenEdit = (patient: AdminPatient) => {
    const matchedCaregiver = caregivers.find((c) => c.name === patient.caregiver);
    setEditPatient({
      id: patient.id,
      name: patient.name,
      caregiver: matchedCaregiver?.id || "",
    });
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleEditPatient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editPatient.name) return;

    const token = localStorage.getItem("token") || "";
    try {
      await updatePatient(token, editPatient.id, {
        name: editPatient.name,
        supervisor: editPatient.caregiver || null,
      });
      setIsEditModalOpen(false);
      await loadData(); // refresh with real saved data rather than guessing the merged shape
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="patients-page">
        <div className="page-toolbar">
          <div>
            <h2>Patient Management</h2>
            <p>Manage patients and monitor their activity.</p>
          </div>
        </div>
        <div className="patients-card">
          <div className="empty-state">Loading patients...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="patients-page">
        <div className="page-toolbar">
          <div>
            <h2>Patient Management</h2>
            <p>Manage patients and monitor their activity.</p>
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
          <h2>Patient Management</h2>
          <p>Manage patients and monitor their activity.</p>
        </div>

        <button className="primary-button" onClick={() => setIsModalOpen(true)}>
          + Add Patient
        </button>
      </div>

      <div className="patients-card">
        <div className="patients-card-header">
          <div>
            <h3>Patients</h3>
            <span>{filteredPatients.length} patients</span>
          </div>

          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Caregiver</th>
                <th>Activities</th>
                <th>Last Active</th>
                <th>Approved</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="patient-info">
                      <div className="table-avatar">{patient.name.charAt(0)}</div>
                      <strong>{patient.name}</strong>
                    </div>
                  </td>

                  <td>{patient.caregiver}</td>

                  <td>{patient.activities}</td>

                  <td>{formatLastActive(patient.lastActive)}</td>

                  <td>
                    <span
                      className={`table-status ${
                        patient.isApproved ? "status-active" : "status-inactive"
                      }`}
                    >
                      {patient.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td>
                    <div className="action-menu-container">
                      <button
                        className="action-button"
                        onClick={() =>
                          setActiveMenu(activeMenu === patient.id ? null : patient.id)
                        }
                      >
                        ⋮
                      </button>

                      {activeMenu === patient.id && (
                        <div className="action-menu">
                          <button onClick={() => handleViewPatient(patient)}>👁 View</button>
                          <button onClick={() => handleOpenEdit(patient)}>✏ Edit</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPatients.length === 0 && (
            <div className="empty-state">No patients found.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>Add New Patient</h3>
                <p>Enter the patient's information.</p>
              </div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <div className="empty-state">
              Creating patients from the admin panel isn't wired up yet — there's no
              backend endpoint for it.
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal patient-profile-modal">
            <div className="modal-header">
              <div>
                <h3>Patient Profile</h3>
                <p>Patient information and activity overview.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedPatient(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="patient-profile-header">
              <div className="profile-avatar">{selectedPatient.name.charAt(0)}</div>
              <div>
                <h2>{selectedPatient.name}</h2>
                <p>{selectedPatient.email}</p>
                <span
                  className={`table-status ${
                    selectedPatient.isApproved ? "status-active" : "status-inactive"
                  }`}
                >
                  {selectedPatient.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-info-item">
                <span>Caregiver</span>
                <strong>{selectedPatient.caregiver}</strong>
              </div>

              <div className="profile-info-item">
                <span>Last Active</span>
                <strong>{formatLastActive(selectedPatient.lastActive)}</strong>
              </div>

              <div className="profile-info-item">
                <span>Activities Completed</span>
                <strong>{selectedPatient.activities}</strong>
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
                <h3>Edit Patient</h3>
                <p>Update the patient's information.</p>
              </div>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleEditPatient}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editPatient.name}
                  onChange={(event) =>
                    setEditPatient({ ...editPatient, name: event.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Caregiver</label>
                <select
                  value={editPatient.caregiver}
                  onChange={(event) =>
                    setEditPatient({ ...editPatient, caregiver: event.target.value })
                  }
                >
                  <option value="">Unassigned</option>
                  {caregivers.map((caregiver) => (
                    <option key={caregiver.id} value={caregiver.id}>
                      {caregiver.name}
                    </option>
                  ))}
                </select>
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

export default Patients;