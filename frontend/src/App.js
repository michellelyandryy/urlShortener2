import React, { useState } from "react";
import Sidebar from "./Components/sideBar";
import UrlDashboard from "./Pages/urlDashboard";
import AnalyticsPage from "./Pages/analyticsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./style/App.css";
import "./style/sideBar.css";
import "./style/urlDashboard.css";
import "./style/analyticsPage.css";

function App() {
  const [activePage, setActivePage] = useState("urls");

  return (
    <div className="grid-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="content">
        {activePage === "urls" ? <UrlDashboard /> : <AnalyticsPage />}
      </main>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
}

export default App;
