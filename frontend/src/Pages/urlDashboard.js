import React, { useState, useEffect } from "react";
import { FaQrcode, FaCopy, FaTrash } from "react-icons/fa";
import "../style/urlDashboard.css";
import LinkCard from "../Components/linkCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UrlDashboard = () => {
  const [urlInput, setUrlInput] = useState("");
  // const [aliasInput, setAliasInput] = useState("");
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all existing links
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/links");
        setLinks(response.data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
        setError("Failed to load URLs from the server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleShorten = async () => {

    //trim
    const trimmedLink = urlInput.trim();

    if (!trimmedLink){
      alert("Please enter a link");
      return;
    } 

    try{
      new URL(trimmedLink);
    } catch (error){
      alert("Please enter a valid link");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/links", {
        long_link: urlInput,
        // custom_alias: aliasInput
      });

      if (res.status === 200 || res.status === 201) {
        setLinks([...links, res.data]);
        setUrlInput("");
        // setAliasInput("");
        setError(null);
      } else {
        alert("Unexpected server response.");
      }
    } catch (err) {
      console.error("Shorten error:", err);
      setError(err.response?.data?.message || "Failed to shorten URL");
    }
  };

return (
  <div className="url-dashboard">
    <div className="dashboard-header">
      <h2>URL Shortener</h2>
    </div>

    <div className="url-form">
      <input
        type="text"
        placeholder="Enter your long URL"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        disabled={isLoading}
      />
      {/* <input
        type="text"
        placeholder="Custom Alias (optional)"
        value={aliasInput}
        onChange={(e) => setAliasInput(e.target.value)}
        maxLength={20}
        disabled={isLoading}
      /> */}
      <button
        className="btn-shorten"
        onClick={handleShorten}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Shorten"}
      </button>
    </div>

    {error && <div className="error-message">{error}</div>}

    {isLoading && links.length === 0 ? (
      <div className="loading-message">Loading your URLs...</div>
    ) : links.length === 0 ? (
      <p className="empty-message">No URLs yet. Try shortening one above.</p>
    ) : (
      <div className="url-list">
        {links.map((link, index) => (
          <div className="url-batch-inner" key={`link-${link.short_link || index}`}>
            <LinkCard
              originalUrl={link.long_link}
              shortUrl={link.short_link}
              // customAlias={link.custom_alias || ""}
            />
          </div>
        ))}
      </div>
    )}
  </div>
);
      {isLoading && links.length === 0 ? (
        <div className="loading-message">Loading your URLs...</div>
      ) : links.length === 0 && batches.length === 0 ? (
        <p className="empty-message">No URLs yet. Try shortening one above.</p>
      ) : (
        <div className="url-list">
          {links.map((link, index) => (
            <div className="url-batch-inner" key={`link-${link.short_link || index}`}>
              <LinkCard
                originalUrl={link.long_link}
                shortUrl={link.short_link}
                onCopy={(copiedText) => toast.success(`Copied: ${copiedText}`)}
              />
            </div>
          ))}

          {batches.map((batch, batchIndex) => (
            <div className="url-batch" key={`batch-${batchIndex}`}>
              {batch.map((link, index) => (
                <div className="url-card" key={`batch-${batchIndex}-link-${index}`}>
                  <div>
                    <p className="label">Original URL</p>
                    <p>{link.originalUrl}</p>
                  </div>
                  <div>
                    <p className="label">ShortURL</p>
                    <p>{link.shortUrl}</p>
                  </div>
                  <div className="actions">
                    <button title="QR"><FaQrcode /></button>
                    <button title="Copy"><FaCopy /></button>
                    <button title="Delete"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default UrlDashboard;