import React, { useState, useEffect } from "react";
import { FaQrcode, FaCopy, FaTrash } from "react-icons/fa";
import "../style/urlDashboard.css";
import BatchModal from "../Components/batchForm.js"; 
import LinkCard from "../Components/linkCard";
import QrPopup from "../Components/qrPopup.js";
import { toast } from "react-toastify";
import axios from "axios";

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
  const [batches, setBatches] = useState([]);
  const [showBatch, setShowBatch] = useState(false);
  const [batchInputs, setBatchInputs] = useState(["", ""]);
  const [selectedQR, setSelectedQR] = useState(null); 

  useEffect(() => {
    document.body.classList.toggle("modal-open", showBatch);
  }, [showBatch]);

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
    if (aliasInput.length > 20) {
      alert("Custom alias cannot be longer than 20 characters.");
      return;
    }

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

  const handleBatchSubmit = () => {
    const validUrls = batchInputs.filter((url) => url.trim() !== "");

    if (validUrls.length < 2) {
      alert("Please enter at least 2 valid URLs.");
      return;
    }

    const newLinks = validUrls.map((url) => ({
      originalUrl: url,
      shortUrl: `short.ly/${generateShortCode()}`
    }));

    setBatches([...batches, newLinks]); 
    setBatchInputs(["", ""]);
    setShowBatch(false);

    /*
    axios.post("/api/urls/batch", {
      urls: validUrls
    }).then(() => {
      setShowBatch(false);
      setBatchInputs(["", ""]);
      // Optionally refresh links from backend
    }).catch((err) => {
      console.error("Batch submission failed:", err);
    });
    */
  };

  return (
    <div className="url-dashboard">
      {showBatch && (
        <BatchModal
        batchInputs={batchInputs}
        onClose={() => {
          setShowBatch(false);
          setBatchInputs(["", ""]); 
       }}
        onAddInput={handleAddBatchInput}
        onInputChange={handleBatchInputChange}
        onSubmit={handleBatchSubmit}
      />
    )}

      {selectedQR && (
        <QrPopup
          url={selectedQR}
          onClose={() => setSelectedQR(null)}
        />
      )}

      <div className="dashboard-header">
        <h2>URL Shortener</h2>
        <button className="btn-batch" onClick={() => setShowBatch(true)}>
          + Create Batch
        </button>
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
          maxLength={20}
        />
        <button className="btn-shorten" onClick={handleShorten}>
          Shorten
        </button>
      </div>

      {links.length === 0 && batches.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No URLs yet. Try shortening one above.</p>
      ) : (
        <div className="url-list">

          {links.map((link, index) => (
            <div className="url-batch-inner" key={`link-${index}`}>
              <LinkCard
                originalUrl={link.originalUrl}
                shortUrl={link.shortUrl}
                customAlias={link.customAlias}
                onShowQR={setSelectedQR}
                onCopy={(copiedText) => console.log("Copied:", copiedText)}
                onDelete={() => {
                  const updatedLinks = [...links];
                  updatedLinks.splice(index, 1);
                  setLinks(updatedLinks);
                }}
              />
            </div>
          ))}

          {batches.map((batch, batchIndex) => (
            <div className="url-batch" key={`batch-${batchIndex}`}>
              {batch.map((link, linkIndex) => (
                <LinkCard
                  key={`batch-${batchIndex}-link-${linkIndex}`}
                  originalUrl={link.originalUrl}
                  shortUrl={link.shortUrl}
                  customAlias={link.customAlias}
                  onShowQR={setSelectedQR}
                  onCopy={() => toast.success("Copied to clipboard!")}
                  onDelete={() => {
                    const updatedBatch = [...batch];
                    updatedBatch.splice(linkIndex, 1);

                    const updatedBatches = [...batches];
                    if (updatedBatch.length === 0) {
                      updatedBatches.splice(batchIndex, 1);
                    } else {
                      updatedBatches[batchIndex] = updatedBatch;
                    }

                    setBatches(updatedBatches);
                  }}
                />
              ))}
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default UrlDashboard;
