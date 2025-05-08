import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLink } from "react-icons/fa";
import "../style/analyticsPage.css";

const AnalyticsPage = () => {
  const [data, setData] = useState({
    mostClicked: null,
    leastClicked: null,
    recentClick: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📡 Attempting to fetch analytics...");

    axios.get("http://localhost:5000/api/links/analytics")
      .then(res => {
        console.log("Analytics data received:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error("Analytics fetch error:", err);
        setError("Failed to fetch analytics.");
      });
  }, []);

  const renderCard = (label, linkObj) => (
    <div className="card">
      <h4>{label}</h4>
      {linkObj ? (
        <a
          href={`http://localhost:5000/api/links/${linkObj.short_link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLink style={{ marginRight: "0.5rem" }} />
          short.ly/{linkObj.short_link}
        </a>
      ) : (
        <p>Not available</p>
      )}
    </div>
  );

  return (
    <div className="analytics">
      <h2>Analytics</h2>
      {error && <p className="error">{error}</p>}
      {renderCard("Most Clicked URL", data.mostClicked)}
      {renderCard("Least Clicked URL", data.leastClicked)}
      {renderCard("Recently Clicked", data.recentClick)}
    </div>
  );
};

export default AnalyticsPage;
