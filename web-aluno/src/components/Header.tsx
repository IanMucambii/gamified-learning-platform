import React from "react";

interface HeaderProps {
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  return (
    <header className="top-header">

      <div>
        <h1>
          {activePage === "Dashboard"
            ? "Good morning, Maria! 👋"
            : activePage}
        </h1>

        <p>
          {activePage === "Dashboard"
            ? "Ready for today's activities?"
            : `Welcome to your ${activePage.toLowerCase()} page.`}
        </p>
      </div>

      <div className="profile">

        <div className="profile-avatar">
          M
        </div>

        <div>
          <strong>Maria Silva</strong>
          <span>Patient</span>
        </div>

      </div>

    </header>
  );
};

export default Header;