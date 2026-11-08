import React from "react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  onLogout,
}) => {
  const menuItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Activities", icon: "🎮" },
    { name: "Achievements", icon: "🏆" },
    { name: "Progress", icon: "📊" },
    { name: "Profile", icon: "👤" },
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        🧠
        <span>MindCare</span>
      </div>

      <nav>
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

      <button
        className="logout-button"
        onClick={onLogout}
      >
        <span className="nav-icon">↪</span>
        <span>Logout</span>
      </button>

    </aside>
  );
};

export default Sidebar;