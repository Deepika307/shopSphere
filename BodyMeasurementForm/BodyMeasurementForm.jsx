import React, { useState } from "react";
import "./BodyMeasurementForm.css";

const BodyMeasurementForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    chest: "",
    waist: "",
    hips: "",
  });

  const [bodyShape, setBodyShape] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const chest = parseFloat(formData.chest);
    const waist = parseFloat(formData.waist);
    const hips = parseFloat(formData.hips);

    let shape = "Unknown";
    if (chest < hips && waist < chest && waist < hips) shape = "Pear";
    else if (chest > hips && waist < chest && waist < hips)
      shape = "Inverted Triangle";
    else if (waist < chest && waist < hips && chest === hips)
      shape = "Hourglass";
    else if (chest === waist && waist === hips) shape = "Rectangle";
    else shape = "Apple";

    setBodyShape(shape);
    if (onSubmit) onSubmit({ ...formData, shape });
  };

  return (
    <div className="body-measurement-overlay">
      <div className="body-measurement-modal">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <form className="body-measurement-form" onSubmit={handleSubmit}>
          <h2>Enter Your Measurements</h2>
          <label>
            Chest (cm):
            <input
              type="number"
              name="chest"
              value={formData.chest}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Waist (cm):
            <input
              type="number"
              name="waist"
              value={formData.waist}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Hips (cm):
            <input
              type="number"
              name="hips"
              value={formData.hips}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Detect Body Shape</button>

          {bodyShape && (
            <div className="result">
              Your body shape is: <strong>{bodyShape}</strong>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BodyMeasurementForm;
