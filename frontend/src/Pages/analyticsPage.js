import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLink } from "react-icons/fa";
import "../style/analyticsPage.css";

const AnalyticsPage = () => {
  const [data, setData] = useState({
    mostClicked: null,
    leastClicked: null,
    recentClick: null, // ✅ fixed typo here
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📡 Attempting to fetch analytics...");
  
    axios.get("http://localhost:5000/api/analytics")
      .then(res => {
        console.log("Analytics data received:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error("Analytics fetch error:", err);
        setError("Failed to fetch analytics.");
      });
  }, []);
  

  const renderCard = (label, short_link) => (
    <div className="card">
      <h4>{label}</h4>
      {short_link ? (
        <a href={`http://localhost:5000/${short_link}`} target="_blank" rel="noopener noreferrer">
          <FaLink /> short.ly/{short_link}
        </a>
      ) : (
        <p>Not available</p>
      )}
    </div>
  );

  return (
    <div className="analytics">
      <h2>Click Analytics</h2>
      {error && <p className="error">{error}</p>}
      {renderCard("Most Clicked URL", data.mostClicked?.short_link)}
      {renderCard("Least Clicked URL", data.leastClicked?.short_link)}
      {renderCard("Recently Clicked", data.recentClick?.short_link)} {/* ✅ fixed this line */}
    </div>
  );
};

export default AnalyticsPage;
