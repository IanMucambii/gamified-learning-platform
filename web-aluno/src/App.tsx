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

function App() {

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [activePage, setActivePage] =
    useState("Dashboard");


  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
  };


  if (!token) {
    return (
      <Login onLogin={handleLogin} />
    );
  }


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