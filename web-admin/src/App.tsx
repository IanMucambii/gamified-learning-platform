import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Caregivers from "./pages/Caregivers";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

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