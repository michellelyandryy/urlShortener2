import React, { useState, useEffect } from "react";
import { FaQrcode, FaCopy, FaTrash } from "react-icons/fa";
import "../style/urlDashboard.css";
import BatchModal from "../Components/batchForm.js"; 
import LinkCard from "../Components/linkCard";
import axios from "axios";

const UrlDashboard = () => {
  // State declarations
  const [urlInput, setUrlInput] = useState("");
  const [aliasInput, setAliasInput] = useState("");
  const [links, setLinks] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showBatch, setShowBatch] = useState(false);
  const [batchInputs, setBatchInputs] = useState(["", ""]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch links on component mount
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/links");
        setLinks(response.data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
        setError("Failed to load URLs. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLinks();
  }, []);

  const handleShorten = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a URL");
      return;
    }
    
    if (aliasInput.length > 20) {
      setError("Custom alias cannot be longer than 20 characters");
      return;
    }
  
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/links/", {
        long_link: urlInput,
        custom_alias: aliasInput || undefined
      });

      setLinks(prevLinks => [...prevLinks, {
        originalUrl: res.data.long_link,
        shortUrl: res.data.short_link,
        customAlias: res.data.custom_alias || ""
      }]);
      
      setUrlInput("");
      setAliasInput("");
      setError(null);
    } catch (err) {
      console.error("Shorten error:", err);
      setError(err.response?.data?.message || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBatchInput = () => {
    if (batchInputs.length < 10) {
      setBatchInputs([...batchInputs, ""]);
    }
  };

  const handleBatchInputChange = (value, index) => {
    const updated = [...batchInputs];
    updated[index] = value;
    setBatchInputs(updated);
  };

  const handleBatchSubmit = async () => {
    const validUrls = batchInputs.filter(url => url.trim() !== "");

    if (validUrls.length < 2) {
      setError("Please enter at least 2 valid URLs");
      return;
    }

    setIsLoading(true);
    try {
      const batchResponses = await Promise.all(
        validUrls.map(url => 
          axios.post("http://localhost:5000/api/links/batch", {
            long_link: url
          })
        )
      );

      const newLinks = batchResponses.map(res => ({
        originalUrl: res.data.long_link,
        shortUrl: res.data.short_link
      }));

      setBatches(prev => [...prev, newLinks]);
      setBatchInputs(["", ""]);
      setShowBatch(false);
      setError(null);
    } catch (err) {
      console.error("Batch error:", err);
      setError("Failed to create batch URLs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="url-dashboard">
      {showBatch && (
        <BatchModal
          batchInputs={batchInputs}
          onClose={() => setShowBatch(false)}
          onAddInput={handleAddBatchInput}
          onInputChange={handleBatchInputChange}
          onSubmit={handleBatchSubmit}
          isLoading={isLoading}
        />
      )}

      <div className="dashboard-header">
        <h2>URL Shortener</h2>
        <button 
          className="btn-batch" 
          onClick={() => setShowBatch(true)}
          disabled={isLoading}
        >
          + Create Batch
        </button>
      </div>

      <div className="url-form">
        <input
          type="text"
          placeholder="Enter your long URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Custom Alias (optional)"
          value={aliasInput}
          onChange={(e) => setAliasInput(e.target.value)}
          maxLength={20}
          disabled={isLoading}
        />
        <button 
          className="btn-shorten" 
          onClick={handleShorten}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Shorten"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLoading && links.length === 0 ? (
        <div className="loading-message">Loading your URLs...</div>
      ) : links.length === 0 && batches.length === 0 ? (
        <p className="empty-message">No URLs yet. Try shortening one above.</p>
      ) : (
        <div className="url-list">
          {links.map((link, index) => (
            <div className="url-batch-inner" key={`link-${link.shortUrl || index}`}>
              <LinkCard
                originalUrl={link.originalUrl || link.long_link}
                shortUrl={link.shortUrl || link.short_link}
                customAlias={link.customAlias || link.custom_alias}
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
    </div>
  );
};

export default UrlDashboard;