import React, { useState } from "react";
import "./BodyShapeForm.css";

const BodyShapeForm = () => {
  const [form, setForm] = useState({ chest: "", waist: "", hips: "" });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const determineBodyShape = (chest, waist, hips) => {
    const c = parseFloat(chest);
    const w = parseFloat(waist);
    const h = parseFloat(hips);

    if (isNaN(c) || isNaN(w) || isNaN(h)) return "Invalid input";

    const chestToHipDiff = Math.abs(c - h);
    const waistToChest = w / c;
    const waistToHips = w / h;

    if (chestToHipDiff <= 5 && waistToChest > 0.75 && waistToHips > 0.75) {
      return "Rectangle";
    } else if (w < c && w < h && chestToHipDiff <= 5) {
      return "Hourglass";
    } else if (h > c && h - c >= 5) {
      return "Pear";
    } else if (c > h && c - h >= 5) {
      return "Inverted Triangle";
    } else {
      return "Apple";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const shape = determineBodyShape(form.chest, form.waist, form.hips);
    setResult(shape);
  };

  return (
    <div className="body-shape-wrapper">
      <div className="body-shape-card">
        <h2>Find Your Body Shape</h2>
        <form onSubmit={handleSubmit} className="body-shape-form">
          <input
            type="number"
            name="chest"
            placeholder="Chest (in cm)"
            value={form.chest}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="waist"
            placeholder="Waist (in cm)"
            value={form.waist}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="hips"
            placeholder="Hips (in cm)"
            value={form.hips}
            onChange={handleChange}
            required
          />
          <button type="submit">Check Body Shape</button>
        </form>
        {result && (
          <p className="body-shape-result">
            Your Body Shape: <strong>{result}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default BodyShapeForm;
