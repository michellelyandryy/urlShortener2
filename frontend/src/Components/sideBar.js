import React from "react";
import "../style/sideBar.css";
import { FaLink, FaChartLine, FaUnlink } from "react-icons/fa"; // 🟢 fix: use capitalized icon names

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="sideBar">
      <div className="sideBarTitle">
        <span className="logo">
          <FaUnlink className="logo-icon" />
          <span className="accent">Short</span>ly
        </span>
      </div>

      <nav className="nav-links">
        <button
          className={activePage === "urls" ? "active" : ""}
          onClick={() => setActivePage("urls")}
        >
          <FaLink /> URLs
        </button>

        <button
          className={activePage === "analytics" ? "active" : ""}
          onClick={() => setActivePage("analytics")}
        >
          <FaChartLine /> Analytics
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
