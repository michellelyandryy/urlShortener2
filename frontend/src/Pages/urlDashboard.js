import React, { useState } from "react";
import { FaQrcode, FaCopy, FaTrash } from "react-icons/fa";
import "../style/urlDashboard.css";

// Utility function
const generateShortCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const UrlDashboard = () => {
  const [urlInput, setUrlInput] = useState("");
  const [aliasInput, setAliasInput] = useState("");
  const [links, setLinks] = useState([]);

  //mock data
  // const [links, setLinks] = useState([
  //     {
  //         originalUrl: "https://example.com/very/long/url/path",
  //         shortUrl: "short.ly/abc123",
  //         customAlias: "custom/abc123"
  //       },
  //       {
  //         originalUrl: "https://anotherexample.com/page",
  //         shortUrl: "short.ly/xyz789"
  //       }
  // ]);

  // const [links, setLinks] = useState([]);
  // useEffect(() => {
  //     axios.get("/api/urls").then((res) => setLinks(res.data));
  // }, []);

  const handleShorten = () => {
    if (!urlInput.trim()) return;

    const newLink = {
      originalUrl: urlInput,
      shortUrl: `short.ly/${aliasInput || generateShortCode()}`
    };

    if (aliasInput) {
      newLink.customAlias = `custom/${aliasInput}`;
    }

    setLinks([...links, newLink]);
    setUrlInput("");
    setAliasInput("");
  };

  return (
    <div className="url-dashboard">
      <div className="dashboard-header">
        <h2>URL Shortener</h2>
        <button className="btn-batch">+ Create Batch</button>
      </div>

      <div className="url-form">
        <input
          type="text"
          placeholder="Enter your long URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Custom Alias (optional)"
          value={aliasInput}
          onChange={(e) => setAliasInput(e.target.value)}
        />
        <button className="btn-shorten" onClick={handleShorten}>Shorten</button>
      </div>

      {links.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No URLs yet. Try shortening one above.</p>
      ) : (
        <div className="url-list">
          {links.map((link, index) => (
            <div className="url-card" key={index}>
              <div>
                <p className="label">Original URL</p>
                <p>{link.originalUrl}</p>
              </div>
              <div>
                <p className="label">ShortURL</p>
                <p>{link.shortUrl}</p>
              </div>
              {link.customAlias && (
                <div>
                  <p className="label">CustomURL</p>
                  <p>{link.customAlias}</p>
                </div>
              )}
              <div className="actions">
                <button title="QR"><FaQrcode /></button>
                <button title="Copy"><FaCopy /></button>
                <button title="Delete"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlDashboard;
