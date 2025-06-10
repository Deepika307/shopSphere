import React, { useRef, useState } from "react";
import "./BodyScanModal.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const BodyScanModal = ({ onClose }) => {
  const fileInputRef = useRef();
  const videoRef = useRef();
  const [image, setImage] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage({ url, file });
    }
  };

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured.png", { type: "image/png" });
      setImage({ url: canvas.toDataURL("image/png"), file });
    }, "image/png");
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    setStreaming(false);
  };

  const handleSubmit = async () => {
    if (!image?.file) {
      alert("Please upload or capture an image first!");
      return;
    }

    const userId = localStorage.getItem("user-id"); //    ✅ Use correct localStorage key
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("user_id", userId);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload-photo/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.measurements) {
        setMeasurements(response.data.measurements);
        alert("Measurements extracted and saved successfully!");
      } else {
        alert("No measurements found. Please try again.");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-scan-overlay">
      <div className="body-scan-modal">
        <IoMdClose className="modal-close-icon" onClick={onClose} />
        <h2>Upload or Capture Your Photo</h2>

        <div className="modal-actions">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <button onClick={() => fileInputRef.current.click()}>Upload</button>
          <button onClick={handleOpenCamera}>Open</button>
        </div>

        <div className="preview-area">
          {image?.url ? (
            <img src={image.url} alt="Preview" className="preview-image" />
          ) : (
            <video ref={videoRef} autoPlay className="camera-feed" />
          )}
        </div>

        <div className="modal-footer">
          {!image?.url && streaming && (
            <button className="capture-btn" onClick={handleCapture}>
              Capture
            </button>
          )}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {measurements && (
          <div className="result-measurements">
            <h3>Extracted Measurements</h3>
            <ul>
              {Object.entries(measurements).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyScanModal;
