import React, { useState } from "react";
import "./MeasurementForm.css";

const MeasurementForm = () => {
  const [formData, setFormData] = useState({
    height: "",
    waist: "",
    chest: "",
    hips: "",
    inseam: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user-id");
    if (!userId) return alert("Please login first!");

    const payload = { ...formData, user_id: userId };

    try {
      const res = await fetch("http://localhost:8000/save-measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) alert("Measurements saved successfully!");
      else alert("Error saving measurements.");
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="measure-form-container">
      <h2>Enter Your Body Measurements</h2>
      <form onSubmit={handleSubmit}>
        {["height", "waist", "chest", "hips", "inseam"].map((field) => (
          <div className="form-group" key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)} (in cm)
            </label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Save Measurements</button>
      </form>
    </div>
  );
};

export default MeasurementForm;
