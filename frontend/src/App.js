import React, { useState } from "react";
import Sidebar from "./Components/sideBar";
import UrlDashboard from "./Pages/urlDashboard";
import "./style/App.css";
import "./style/sideBar.css"; // adjust paths if needed
import "./style/urlDashboard.css"; // make sure this exists too

function App() {
  const [activePage, setActivePage] = useState("urls");

  return (
    <div className="grid-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="content">
        {activePage === "urls" ? (
          <UrlDashboard />
        ) : (
          <p style={{ color: "white" }}>Analytics page coming soon.</p>
        )}
      </main>
    </div>
  );
}

export default App;
