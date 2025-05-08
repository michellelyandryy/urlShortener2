import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../style/qrPopup.css";

const QrPopup = ({ url, onClose }) => {
//redirect url
  const fullLink = `http://localhost:5000/api/links/${url.replace("short.ly/", "")}`;

  const downloadQR = () => {
    const canvas = document.getElementById("qrCodeCanvas"); 
    if (!canvas || typeof canvas.toDataURL !== "function") return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qr-${url.replace("/", "-")}.png`;
    downloadLink.click();
  };

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup-content">
        <span className="qr-close" onClick={onClose}>×</span>

        <QRCodeCanvas
          value={fullLink}
          size={180}
          bgColor={"#FFFFFF"}
          fgColor={"#000000"}
          level={"H"}
          includeMargin={true}
          id="qrCodeCanvas" 
        />

        <p className="qr-url-display">{fullLink}</p>

        <button className="qr-popup-button" onClick={downloadQR}>
          Download QR
        </button>
      </div>
    </div>
  );
};

export default QrPopup;
