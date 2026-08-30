import React, { useState } from "react";

interface Caregiver {
  id: number;
  name: string;
  email: string;
  phone: string;
  patients: number;
  status: "Active" | "Inactive";
  lastActive: string;
}

const Caregivers: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [selectedCaregiver, setSelectedCaregiver] =
    useState<Caregiver | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newCaregiver, setNewCaregiver] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editCaregiver, setEditCaregiver] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
  });

  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: 1,
      name: "Ana Silva",
      email: "ana.silva@example.com",
      phone: "+258 84 123 4567",
      patients: 3,
      status: "Active",
      lastActive: "Today",
    },
    {
      id: 2,
      name: "Carla Pereira",
      email: "carla.pereira@example.com",
      phone: "+258 85 234 5678",
      patients: 2,
      status: "Active",
      lastActive: "Today",
    },
    {
      id: 3,
      name: "Miguel Costa",
      email: "miguel.costa@example.com",
      phone: "+258 86 345 6789",
      patients: 4,
      status: "Active",
      lastActive: "Yesterday",
    },
    {
      id: 4,
      name: "Rita Santos",
      email: "rita.santos@example.com",
      phone: "+258 87 456 7890",
      patients: 2,
      status: "Inactive",
      lastActive: "5 days ago",
    },
    {
      id: 5,
      name: "Paulo Mendes",
      email: "paulo.mendes@example.com",
      phone: "+258 88 567 8901",
      patients: 3,
      status: "Active",
      lastActive: "Today",
    },
  ]);


  const filteredCaregivers = caregivers.filter((caregiver) => {
    const search = searchTerm.toLowerCase();

    return (
      caregiver.name.toLowerCase().includes(search) ||
      caregiver.email.toLowerCase().includes(search) ||
      caregiver.phone.toLowerCase().includes(search)
    );
  });

  const handleAddCaregiver = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !newCaregiver.name ||
      !newCaregiver.email ||
      !newCaregiver.phone
    ) {
      return;
    }

    const caregiver: Caregiver = {
      id: Date.now(),
      name: newCaregiver.name,
      email: newCaregiver.email,
      phone: newCaregiver.phone,
      patients: 0,
      status: "Active",
      lastActive: "Never",
    };

    setCaregivers((currentCaregivers) => [
      ...currentCaregivers,
      caregiver,
    ]);

    setNewCaregiver({
      name: "",
      email: "",
      phone: "",
    });

    setIsModalOpen(false);
  };


  const handleViewCaregiver = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };


  const handleOpenEdit = (caregiver: Caregiver) => {
    setEditCaregiver({
      id: caregiver.id,
      name: caregiver.name,
      email: caregiver.email,
      phone: caregiver.phone,
    });

    setIsEditModalOpen(true);
    setActiveMenu(null);
  };


  const handleEditCaregiver = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !editCaregiver.name ||
      !editCaregiver.email ||
      !editCaregiver.phone
    ) {
      return;
    }

    setCaregivers((currentCaregivers) =>
      currentCaregivers.map((caregiver) =>
        caregiver.id === editCaregiver.id
          ? {
              ...caregiver,
              name: editCaregiver.name,
              email: editCaregiver.email,
              phone: editCaregiver.phone,
            }
          : caregiver
      )
    );

    setIsEditModalOpen(false);
  };


  const handleToggleStatus = (caregiverId: number) => {
    setCaregivers((currentCaregivers) =>
      currentCaregivers.map((caregiver) =>
        caregiver.id === caregiverId
          ? {
              ...caregiver,
              status:
                caregiver.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : caregiver
      )
    );

    setActiveMenu(null);
  };

  return (
    <div className="patients-page">

      {}

      <div className="page-toolbar">

        <div>
          <h2>Caregiver Management</h2>

          <p>
            Manage caregivers and monitor their assigned patients.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Caregiver
        </button>

      </div>

      {}

      <div className="patients-card">

        <div className="patients-card-header">

          <div>

            <h3>Caregivers</h3>

            <span>
              {filteredCaregivers.length} caregivers
            </span>

          </div>

          <input
            type="text"
            placeholder="Search caregivers..."
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
                <th>Caregiver</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Patients</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredCaregivers.map((caregiver) => (

                <tr key={caregiver.id}>

                  {/* Caregiver */}

                  <td>

                    <div className="patient-info">

                      <div className="table-avatar">
                        {caregiver.name.charAt(0)}
                      </div>

                      <strong>
                        {caregiver.name}
                      </strong>

                    </div>

                  </td>

                  {/* Email */}

                  <td>
                    {caregiver.email}
                  </td>

                  {}

                  <td>
                    {caregiver.phone}
                  </td>

                  {}

                  <td>
                    {caregiver.patients}
                  </td>

                  {}

                  <td>
                    {caregiver.lastActive}
                  </td>

                  {}

                  <td>

                    <span
                      className={`table-status ${
                        caregiver.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {caregiver.status}
                    </span>

                  </td>

                  {}

                  <td>

                    <div className="action-menu-container">

                      <button
                        className="action-button"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === caregiver.id
                              ? null
                              : caregiver.id
                          )
                        }
                      >
                        ⋮
                      </button>


                      {activeMenu === caregiver.id && (

                        <div className="action-menu">

                          {}

                          <button
                            onClick={() =>
                              handleViewCaregiver(caregiver)
                            }
                          >
                            👁 View
                          </button>


                          {}

                          <button
                            onClick={() =>
                              handleOpenEdit(caregiver)
                            }
                          >
                            ✏ Edit
                          </button>

                          {}

                          <button
                            onClick={() =>
                              handleToggleStatus(caregiver.id)
                            }
                          >
                            {caregiver.status === "Active"
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

          {filteredCaregivers.length === 0 && (

            <div className="empty-state">
              No caregivers found.
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
                  Add New Caregiver
                </h3>

                <p>
                  Enter the caregiver's information.
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


            <form onSubmit={handleAddCaregiver}>

              {}

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter caregiver name"
                  value={newCaregiver.name}
                  onChange={(event) =>
                    setNewCaregiver({
                      ...newCaregiver,
                      name: event.target.value,
                    })
                  }
                />

              </div>


              {}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newCaregiver.email}
                  onChange={(event) =>
                    setNewCaregiver({
                      ...newCaregiver,
                      email: event.target.value,
                    })
                  }
                />

              </div>


              {}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCaregiver.phone}
                  onChange={(event) =>
                    setNewCaregiver({
                      ...newCaregiver,
                      phone: event.target.value,
                    })
                  }
                />

              </div>


              {}

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
                  Add Caregiver
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {}

      {isViewModalOpen && selectedCaregiver && (

        <div className="modal-overlay">

          <div className="modal patient-profile-modal">

            <div className="modal-header">

              <div>

                <h3>
                  Caregiver Profile
                </h3>

                <p>
                  Caregiver information and patient overview.
                </p>

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


            {}

            <div className="patient-profile-header">

              <div className="profile-avatar">
                {selectedCaregiver.name.charAt(0)}
              </div>


              <div>

                <h2>
                  {selectedCaregiver.name}
                </h2>

                <p>
                  {selectedCaregiver.email}
                </p>

                <span
                  className={`table-status ${
                    selectedCaregiver.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {selectedCaregiver.status}
                </span>

              </div>

            </div>


            {}

            <div className="profile-info">

              <div className="profile-info-item">

                <span>
                  Phone
                </span>

                <strong>
                  {selectedCaregiver.phone}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Last Active
                </span>

                <strong>
                  {selectedCaregiver.lastActive}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Assigned Patients
                </span>

                <strong>
                  {selectedCaregiver.patients}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Account Status
                </span>

                <strong>
                  {selectedCaregiver.status}
                </strong>

              </div>

            </div>


            {}

            <div className="recent-activities">

              <h4>
                Assigned Patients
              </h4>


              {selectedCaregiver.patients > 0 ? (

                <>
                  <div className="activity-row">
                    <span>
                      Patient 1
                    </span>

                    <span>
                      Active
                    </span>
                  </div>


                  <div className="activity-row">
                    <span>
                      Patient 2
                    </span>

                    <span>
                      Active
                    </span>
                  </div>


                  {selectedCaregiver.patients >= 3 && (

                    <div className="activity-row">
                      <span>
                        Patient 3
                      </span>

                      <span>
                        Active
                      </span>
                    </div>

                  )}

                  {selectedCaregiver.patients >= 4 && (

                    <div className="activity-row">
                      <span>
                        Patient 4
                      </span>

                      <span>
                        Active
                      </span>
                    </div>

                  )}

                </>

              ) : (

                <div className="empty-state">
                  No patients assigned.
                </div>

              )}

            </div>

          </div>

        </div>

      )}


      {}

      {isEditModalOpen && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h3>
                  Edit Caregiver
                </h3>

                <p>
                  Update the caregiver's information.
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


            <form onSubmit={handleEditCaregiver}>

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={editCaregiver.name}
                  onChange={(event) =>
                    setEditCaregiver({
                      ...editCaregiver,
                      name: event.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={editCaregiver.email}
                  onChange={(event) =>
                    setEditCaregiver({
                      ...editCaregiver,
                      email: event.target.value,
                    })
                  }
                />

              </div>


              {/* Phone */}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  value={editCaregiver.phone}
                  onChange={(event) =>
                    setEditCaregiver({
                      ...editCaregiver,
                      phone: event.target.value,
                    })
                  }
                />

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

export default Caregivers;