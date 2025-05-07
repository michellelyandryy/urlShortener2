import React from "react";
import { FaQrcode, FaCopy, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "../style/urlDashboard.css";
import { Tooltip } from "react-tooltip";
const LinkCard = ({ originalUrl, shortUrl, customAlias, onShowQR, onCopy, onDelete }) => {
  const handleCopy = () => {
    const textToCopy = customAlias || shortUrl;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Copied to clipboard!");
      if (onCopy) onCopy(textToCopy);
    });
  };

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
        <button title="Copy" onClick={handleCopy}>
          <FaCopy />
        </button>
        <button title="Delete" onClick={onDelete}>
          <FaTrash />
        </button>
        <Tooltip id="tooltip" />
      </div>
    </div>
  );
};

export default LinkCard;
