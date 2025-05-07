import React from "react";
import { FaQrcode, FaCopy, FaTrash } from "react-icons/fa";
import "../style/urlDashboard.css";

const LinkCard = ({ originalUrl, shortUrl, customAlias, onShowQR }) => {
  return (
    <div className="url-card">
      <div>
        <p className="label">Original URL</p>
        <p>{originalUrl}</p>
      </div>
      <div>
        <p className="label">ShortURL</p>
        <p>{customAlias || shortUrl}</p>
      </div>
      <div className="actions">
        <button title="QR" onClick={() => onShowQR(customAlias || shortUrl)}>
          <FaQrcode />
        </button>
        <button title="Copy"><FaCopy /></button>
        <button title="Delete"><FaTrash /></button>
      </div>
    </div>
  );
};

export default LinkCard;
