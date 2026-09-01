import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Achievements from "./pages/Achievements";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Activities":
        return <Activities />;

      case "Achievements":
        return <Achievements />;

      case "Progress":
        return <Progress />;

      case "Profile":
        return <Profile />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">

        <Header activePage={activePage} />

        <div className="page-content">
          {renderPage()}
        </div>

      </main>

    </div>
  );
}

export default App;