function Profile() {
  return (
    <div className="profile-page">

      {/* Page Header */}
      <div className="page-title">
        <h2>My Profile 👤</h2>
        <p>
          View your personal information and account details.
        </p>
      </div>


      {/* Profile Card */}
      <section className="profile-card">

        <div className="profile-card-header">

          <div className="large-profile-avatar">
            M
          </div>

          <div>
            <h2>Maria Silva</h2>
            <p>Patient</p>
          </div>

        </div>


        {/* Personal Information */}
        <div className="profile-section">

          <h3>Personal Information</h3>

          <div className="profile-details">

            <div className="profile-field">
              <span>Full Name</span>
              <strong>Maria Silva</strong>
            </div>

            <div className="profile-field">
              <span>Date of Birth</span>
              <strong>15 March 1945</strong>
            </div>

            <div className="profile-field">
              <span>Email</span>
              <strong>maria@example.com</strong>
            </div>

            <div className="profile-field">
              <span>Phone</span>
              <strong>+258 84 123 4567</strong>
            </div>

          </div>

        </div>


        {/* Account Information */}
        <div className="profile-section">

          <h3>Account Information</h3>

          <div className="profile-details">

            <div className="profile-field">
              <span>Patient ID</span>
              <strong>PAT-001</strong>
            </div>

            <div className="profile-field">
              <span>Member Since</span>
              <strong>January 2026</strong>
            </div>

            <div className="profile-field">
              <span>Caregiver</span>
              <strong>John Silva</strong>
            </div>

            <div className="profile-field">
              <span>Account Status</span>
              <strong className="account-active">
                Active
              </strong>
            </div>

          </div>

        </div>


        {/* Statistics */}
        <div className="profile-section">

          <h3>My Statistics</h3>

          <div className="profile-statistics">

            <div>
              <span>Total XP</span>
              <strong>1,240</strong>
            </div>

            <div>
              <span>Activities</span>
              <strong>24</strong>
            </div>

            <div>
              <span>Achievements</span>
              <strong>8</strong>
            </div>

            <div>
              <span>Current Streak</span>
              <strong>5 days</strong>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Profile;