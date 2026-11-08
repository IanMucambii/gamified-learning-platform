import React from "react";

interface HeaderProps {
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  return (
    <header className="header">
      <div>
        <h1>{activePage}</h1>
        <p>Manage and monitor the MindCare platform.</p>
      </div>

      <div className="header-actions">
        <button className="notification-button">
          🔔
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;