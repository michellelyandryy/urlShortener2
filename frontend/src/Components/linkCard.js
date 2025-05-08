import React, { use, useState } from "react";
import { FaQrcode, FaCopy, FaTrash } from "react-icons/fa";
import "../style/urlDashboard.css";
import QrPopup from "./qrPopup";


const LinkCard = ({ 
  originalUrl, 
  shortUrl, 
  customAlias, 
  onShowQR, 
  onCopy, 
  onDelete }) => {

  const [showQRPopup, setShowQRPopup] = useState(false);
  const toggleQRPopup = () => {
    setShowQRPopup(!showQRPopup);
  };

  const handleCopy = () => {
    const textToCopy = customAlias || shortUrl;
    navigator.clipboard.writeText(textToCopy);
    if (onCopy) onCopy(textToCopy);
  };

  return (
    <div className="url-card">
      <div>
        <p className="label">Original URL</p>
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-text"
        >
          {originalUrl}
        </a>
      </div>
      <div>
        <p className="label">ShortURL</p>
        <a
          href={`http://localhost:5000/api/links/${shortUrl.replace("short.ly/", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-text"
        >
          {customAlias || shortUrl}
        </a>
      </div>
      <div className="actions">
        <button title="QR" onClick={toggleQRPopup}>
          <FaQrcode />
        </button>
        <button title="Copy" onClick={handleCopy}>
          <FaCopy />
        </button>
        <button title="Delete" onClick={onDelete}>
          <FaTrash />
        </button>
      </div>
      {/* conditional rendering QR */}
      {showQRPopup && (
        <QrPopup
          url={customAlias || shortUrl}
          onClose={() => setShowQRPopup(false)}
        />
      )}
    </div>
  );
};

export default LinkCard;
