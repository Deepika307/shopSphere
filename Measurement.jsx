import React, { useState } from "react";
import axios from "axios";

const Measurement = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", selectedImage);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/measure", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMeasurements(res.data); // no alert — we use this data to render below
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Is backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Upload Your Photo
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Get Measurements"}
      </button>

      {measurements && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-bold mb-2">Extracted Measurements:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(measurements).map(([key, value]) => (
              <li key={key} className="capitalize">
                <strong>{key.replace("_", " ")}</strong>: {value} cm
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Measurement;
