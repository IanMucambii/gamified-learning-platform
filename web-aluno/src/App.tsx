import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Achievements from "./pages/Achievements";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Login from "./pages/login";
import Play from "./pages/Play";

type ActivityType = "quiz" | "puzzle" | "resonance";

interface SelectedActivity {
  type: ActivityType;
  id: string;
}

function App() {

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [selectedActivity, setSelectedActivity] =
    useState<SelectedActivity | null>(null);


  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
  };


  const handlePlayActivity = (type: ActivityType, id: string) => {
    setSelectedActivity({ type, id });
    setActivePage("Play");
  };


  const handleExitActivity = () => {
    setSelectedActivity(null);
    setActivePage("Activities");
  };


  if (!token) {
    return (
      <Login onLogin={handleLogin} />
    );
  }


  const renderPage = () => {

    switch (activePage) {

      case "Dashboard":
        return <Dashboard onPlayActivity={handlePlayActivity} />;

      case "Activities":
        return <Activities onPlayActivity={handlePlayActivity} />;

      case "Play":
        return selectedActivity ? (
          <Play
            type={selectedActivity.type}
            id={selectedActivity.id}
            onExit={handleExitActivity}
          />
        ) : (
          <Activities onPlayActivity={handlePlayActivity} />
        );

      case "Achievements":
        return <Achievements />;

      case "Progress":
        return <Progress />;

      case "Profile":
        return <Profile />;

      default:
        return <Dashboard onPlayActivity={handlePlayActivity} />;
    }

  };


  return (
    <div className="app">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <main className="main-content">

        <Header
          activePage={activePage}
        />

        <div className="page-content">
          {renderPage()}
        </div>

      </main>

    </div>
  );
}

export default App;