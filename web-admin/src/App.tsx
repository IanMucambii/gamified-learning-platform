import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Caregivers from "./pages/Caregivers";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { getMe } from "./services/api";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    async function verifyStoredToken() {
      const stored = localStorage.getItem("token");
      if (!stored) {
        setCheckingAuth(false);
        return;
      }

      try {
        const me = await getMe(stored);
        if (me.role === "admin") {
          setToken(stored);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyStoredToken();
  }, []);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (checkingAuth) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Patients":
        return <Patients />;

      case "Caregivers":
        return <Caregivers />;

      case "Activities":
        return <Activities />;

      case "Reports":
        return <Reports />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
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