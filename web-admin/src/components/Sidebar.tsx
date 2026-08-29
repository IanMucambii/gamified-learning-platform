import React from "react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
}) => {
  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Patients", icon: "👥" },
    { name: "Caregivers", icon: "♥" },
    { name: "Activities", icon: "🎮" },
    { name: "Reports", icon: "▥" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🧠</div>
        <div>
          <h2>MindCare</h2>
          <span>Support Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </button>

        <button className="nav-item">
          <span className="nav-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;