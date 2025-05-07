import React, { useState } from "react";
import Sidebar from "./Components/sideBar";
import UrlDashboard from "./Pages/urlDashboard";
import AnalyticsPage from "./Pages/analyticsPage";

import "./style/App.css";
import "./style/sideBar.css";
import "./style/urlDashboard.css";
import "./style/analyticsPage.css"; 

function App() {
  const [activePage, setActivePage] = useState("urls");

  return (
    <div className="grid-layout">
      {/* Sidebar navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main content area */}
      <main className="content">
        {activePage === "urls" ? (
          <UrlDashboard />
        ) : (
          <AnalyticsPage />
        )}
      </main>
    </div>
  );
}

export default App;
