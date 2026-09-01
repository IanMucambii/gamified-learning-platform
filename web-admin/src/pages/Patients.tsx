import React, { useState } from "react";

interface Patient {
  id: number;
  name: string;
  age: number;
  caregiver: string;
  activities: number;
  status: "Active" | "Inactive";
  lastActive: string;
}

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    caregiver: "",
  });

  const [editPatient, setEditPatient] = useState({
    id: 0,
    name: "",
    age: "",
    caregiver: "",
  });

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: "Maria Silva",
      age: 72,
      caregiver: "Ana Silva",
      activities: 12,
      status: "Active",
      lastActive: "Today",
    },
    {
      id: 2,
      name: "João Pereira",
      age: 68,
      caregiver: "Carla Pereira",
      activities: 8,
      status: "Active",
      lastActive: "Today",
    },
    {
      id: 3,
      name: "António Costa",
      age: 76,
      caregiver: "Miguel Costa",
      activities: 5,
      status: "Inactive",
      lastActive: "3 days ago",
    },
    {
      id: 4,
      name: "Helena Santos",
      age: 70,
      caregiver: "Rita Santos",
      activities: 15,
      status: "Active",
      lastActive: "Yesterday",
    },
    {
      id: 5,
      name: "Carlos Mendes",
      age: 74,
      caregiver: "Paulo Mendes",
      activities: 10,
      status: "Active",
      lastActive: "Today",
    },
  ]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleAddPatient = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !newPatient.name ||
      !newPatient.age ||
      !newPatient.caregiver
    ) {
      return;
    }

    const patient: Patient = {
      id: Date.now(),
      name: newPatient.name,
      age: Number(newPatient.age),
      caregiver: newPatient.caregiver,
      activities: 0,
      status: "Active",
      lastActive: "Never",
    };

    setPatients((currentPatients) => [
      ...currentPatients,
      patient,
    ]);

    setNewPatient({
      name: "",
      age: "",
      caregiver: "",
    });

    setIsModalOpen(false);
  };


  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };


  const handleOpenEdit = (patient: Patient) => {
    setEditPatient({
      id: patient.id,
      name: patient.name,
      age: String(patient.age),
      caregiver: patient.caregiver,
    });

    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleEditPatient = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !editPatient.name ||
      !editPatient.age ||
      !editPatient.caregiver
    ) {
      return;
    }

    setPatients((currentPatients) =>
      currentPatients.map((patient) =>
        patient.id === editPatient.id
          ? {
              ...patient,
              name: editPatient.name,
              age: Number(editPatient.age),
              caregiver: editPatient.caregiver,
            }
          : patient
      )
    );

    setIsEditModalOpen(false);
  };


  const handleToggleStatus = (patientId: number) => {
    setPatients((currentPatients) =>
      currentPatients.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              status:
                patient.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : patient
      )
    );

    setActiveMenu(null);
  };

  return (
    <div className="patients-page">

      {}

      <div className="page-toolbar">
        <div>
          <h2>Patient Management</h2>
          <p>
            Manage patients and monitor their activity.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Patient
        </button>
      </div>


      {}

      <div className="patients-card">

        <div className="patients-card-header">

          <div>
            <h3>Patients</h3>

            <span>
              {filteredPatients.length} patients
            </span>
          </div>

          <input
            type="text"
            placeholder="Search patients..."
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
                <th>Patient</th>
                <th>Age</th>
                <th>Caregiver</th>
                <th>Activities</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {filteredPatients.map((patient) => (

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
                    {patient.age}
                  </td>

                  <td>
                    {patient.caregiver}
                  </td>

                  <td>
                    {patient.activities}
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

                  <td>

                    <div className="action-menu-container">

                      <button
                        className="action-button"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === patient.id
                              ? null
                              : patient.id
                          )
                        }
                      >
                        ⋮
                      </button>


                      {activeMenu === patient.id && (

                        <div className="action-menu">

                          {/* View */}
                          <button
                            onClick={() =>
                              handleViewPatient(patient)
                            }
                          >
                            👁 View
                          </button>


                          {/* Edit */}
                          <button
                            onClick={() =>
                              handleOpenEdit(patient)
                            }
                          >
                            ✏ Edit
                          </button>


                          {/* Activate / Deactivate */}
                          <button
                            onClick={() =>
                              handleToggleStatus(patient.id)
                            }
                          >
                            {patient.status === "Active"
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

          {}

          {filteredPatients.length === 0 && (
            <div className="empty-state">
              No patients found.
            </div>
          )}

        </div>

      </div>


      {}

      {isModalOpen && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h3>
                  Add New Patient
                </h3>

                <p>
                  Enter the patient's information.
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


            <form onSubmit={handleAddPatient}>

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter patient name"
                  value={newPatient.name}
                  onChange={(event) =>
                    setNewPatient({
                      ...newPatient,
                      name: event.target.value,
                    })
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Age
                </label>

                <input
                  type="number"
                  placeholder="Enter age"
                  value={newPatient.age}
                  onChange={(event) =>
                    setNewPatient({
                      ...newPatient,
                      age: event.target.value,
                    })
                  }
                />

              </div>


              {/* Caregiver */}

              <div className="form-group">

                <label>
                  Caregiver
                </label>

                <select
                  value={newPatient.caregiver}
                  onChange={(event) =>
                    setNewPatient({
                      ...newPatient,
                      caregiver: event.target.value,
                    })
                  }
                >

                  <option value="">
                    Select caregiver
                  </option>

                  <option value="Ana Silva">
                    Ana Silva
                  </option>

                  <option value="Carla Pereira">
                    Carla Pereira
                  </option>

                  <option value="Miguel Costa">
                    Miguel Costa
                  </option>

                  <option value="Rita Santos">
                    Rita Santos
                  </option>

                  <option value="Paulo Mendes">
                    Paulo Mendes
                  </option>

                </select>

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
                  Add Patient
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {}

      {isViewModalOpen && selectedPatient && (

        <div className="modal-overlay">

          <div className="modal patient-profile-modal">

            <div className="modal-header">

              <div>

                <h3>
                  Patient Profile
                </h3>

                <p>
                  Patient information and activity overview.
                </p>

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

              <div className="profile-avatar">
                {selectedPatient.name.charAt(0)}
              </div>


              <div>

                <h2>
                  {selectedPatient.name}
                </h2>

                <p>
                  Age: {selectedPatient.age}
                </p>

                <span
                  className={`table-status ${
                    selectedPatient.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {selectedPatient.status}
                </span>

              </div>

            </div>

            <div className="profile-info">

              <div className="profile-info-item">

                <span>
                  Caregiver
                </span>

                <strong>
                  {selectedPatient.caregiver}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Last Active
                </span>

                <strong>
                  {selectedPatient.lastActive}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Activities Completed
                </span>

                <strong>
                  {selectedPatient.activities}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  XP Earned
                </span>

                <strong>
                  {selectedPatient.activities * 20}
                </strong>

              </div>

            </div>


            <div className="recent-activities">

              <h4>
                Recent Activities
              </h4>


              <div className="activity-row">
                <span>
                  Memory Match
                </span>

                <span>
                  ✓ Completed
                </span>
              </div>


              <div className="activity-row">
                <span>
                  Word Recall
                </span>

                <span>
                  ✓ Completed
                </span>
              </div>


              <div className="activity-row">
                <span>
                  Pattern Game
                </span>

                <span>
                  ✓ Completed
                </span>
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

                <h3>
                  Edit Patient
                </h3>

                <p>
                  Update the patient's information.
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


            <form onSubmit={handleEditPatient}>

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={editPatient.name}
                  onChange={(event) =>
                    setEditPatient({
                      ...editPatient,
                      name: event.target.value,
                    })
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Age
                </label>

                <input
                  type="number"
                  value={editPatient.age}
                  onChange={(event) =>
                    setEditPatient({
                      ...editPatient,
                      age: event.target.value,
                    })
                  }
                />

              </div>


              {/* Caregiver */}

              <div className="form-group">

                <label>
                  Caregiver
                </label>

                <select
                  value={editPatient.caregiver}
                  onChange={(event) =>
                    setEditPatient({
                      ...editPatient,
                      caregiver: event.target.value,
                    })
                  }
                >

                  <option value="">
                    Select caregiver
                  </option>

                  <option value="Ana Silva">
                    Ana Silva
                  </option>

                  <option value="Carla Pereira">
                    Carla Pereira
                  </option>

                  <option value="Miguel Costa">
                    Miguel Costa
                  </option>

                  <option value="Rita Santos">
                    Rita Santos
                  </option>

                  <option value="Paulo Mendes">
                    Paulo Mendes
                  </option>

                </select>

              </div>


              {/* Buttons */}

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

export default Patients;