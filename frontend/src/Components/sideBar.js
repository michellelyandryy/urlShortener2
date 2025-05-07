// src/Components/sideBar.js
import React from "react";
import { FaLink, FaChartBar } from "react-icons/fa";
import "../style/sideBar.css";

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="sidebar">
      <div
        className="logo"
        onClick={() => setActivePage("urls")}
        style={{ cursor: "pointer" }}
      >
        <img src="/logo192.png" alt="Logo" className="logo-img" />
        <span className="logo-text">Shortly</span>
      </div>

      <ul className="nav-links">
        <li
          className={activePage === "urls" ? "active" : ""}
          onClick={() => setActivePage("urls")}
        >
          <FaLink className="icon" />
          <span>URLs</span>
        </li>
        <li
          className={activePage === "analytics" ? "active" : ""}
          onClick={() => setActivePage("analytics")}
        >
          <FaChartBar className="icon" />
          <span>Analytics</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
