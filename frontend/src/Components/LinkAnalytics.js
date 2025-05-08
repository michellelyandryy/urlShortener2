import React, {useState, useEffect} from 'react';
import {
    getAnalyticsSummary,
    getLinkSummary
} from '../api/api.js';
import { formatNumber, formatDate } from '../utils/formatUtils';

const LinkAnalytics = ({ 
    originalUrl,
    shortCode,
    totalClicks,
    lastClickedAt
}) => {
    const [showSummaryPopup, setShowSummaryPopup] = useState(false);

    const toggleSummaryPopup = () => {
        setShowSummaryPopup(!showSummaryPopup);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Never clicked";
        return new Date(dateString).toLocaleString();
      };

  return (
    <div className="link-analytics-card">
      <div className="link-info">
        <div className="original-url">
          <a href={originalUrl} target="_blank" rel="noopener noreferrer">
            {originalUrl}
          </a>
        </div>
        <div className="short-url">
          <span>short.ly/{shortCode}</span>
        </div>
      </div>

      <button 
        className="show-analytics-btn"
        onClick={toggleSummaryPopup}
      >
        Show Analytics
      </button>

      {showSummaryPopup && (
        <div className="analytics-popup">
          <div className="popup-content">
            <button 
              className="close-btn"
              onClick={toggleSummaryPopup}
            >
              
            </button>
            
            <h3>Analytics Summary</h3>
            
            <div className="analytics-grid">
              <div className="stat-item">
                <h4>Original URL</h4>
                <p>
                  <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                    {originalUrl}
                  </a>
                </p>
              </div>
              
              <div className="stat-item">
                <h4>Short URL</h4>
                <p>short.ly/{shortCode}</p>
              </div>
              
              <div className="stat-item">
                <h4>Total Clicks</h4>
                <p>{formatNumber(totalClicks)}</p>
              </div>
              
              <div className="stat-item">
                <h4>Last Clicked</h4>
                <p>{formatDate(lastClickedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkAnalytics;