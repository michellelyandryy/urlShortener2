import React, { useState } from "react";
import { FaLink } from "react-icons/fa";
import "../style/analyticsPage.css";
import axios from "axios";

// const AnalyticsPage = () => {
//     const [data, setData] = useState(null);
  
//     useEffect(() => {
//       // Fetch analytics data
//       axios.get("http://localhost:5000/api/analytics")
//         .then(res => setData(res.data))
//         .catch(err => console.error("Failed to load analytics", err));
//     }, []);
  
//     if (!data) {
//       return <p style={{ color: "#94a3b8" }}>Loading analytics...</p>;
//     }
  
//     return (
//       <div className="analytics-page">
//         <h2>Analytics: URL Summary</h2>
  
//         <div className="analytics-section">
//           <div className="analytics-card">
//             <p className="label">Most Clicked URL</p>
//             <div className="url-display">
//               <FaLink />
//               <span className="url">{data.mostClicked}</span>
//             </div>
//           </div>
  
//           <div className="analytics-card">
//             <p className="label">Least Clicked URL</p>
//             <div className="url-display">
//               <FaLink />
//               <span className="url">{data.leastClicked}</span>
//             </div>
//           </div>
  
//           <div className="analytics-card">
//             <p className="label">Recently clicked</p>
//             <div className="url-display">
//               <FaLink />
//               <span className="url">{data.recentlyClicked}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

const AnalyticsPage = () => {
    // 🧪 Mock data for now
    const mostClicked = "short.ly/dsajdkh";
    const leastClicked = "short.ly/dhsakjhs";
    const recentlyClicked = "short.ly/djsajk";
  
    return (
      <div className="analytics-page">
        <h2>Analytics: URL NAME</h2>
  
        <div className="analytics-section">
          <div className="analytics-card">
            <p className="label">Most Clicked URL</p>
            <div className="url-display">
              <FaLink />
              <span className="url">{mostClicked}</span>
            </div>
          </div>
  
          <div className="analytics-card">
            <p className="label">Least Clicked URL</p>
            <div className="url-display">
              <FaLink />
              <span className="url">{leastClicked}</span>
            </div>
          </div>
  
          <div className="analytics-card">
            <p className="label">Recently clicked</p>
            <div className="url-display">
              <FaLink />
              <span className="url">{recentlyClicked}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AnalyticsPage;