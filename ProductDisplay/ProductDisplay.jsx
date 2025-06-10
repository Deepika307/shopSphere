// src/Components/ProductDisplay/ProductDisplay.jsx

import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import axios from "axios";

const ProductDisplay = ({ product }) => {
  const { addToCart, cartItems, user } = useContext(ShopContext);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [recommendedSize, setRecommendedSize] = useState("");

  useEffect(() => {
    const cartItem = cartItems[product.id];
    if (cartItem && cartItem.size === selectedSize) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [cartItems, product.id, selectedSize]);

  // Fetch recommended size
  useEffect(() => {
    const fetchRecommendedSize = async () => {
      try {
        if (!user || !user.id) return;

        const response = await axios.get(
          `${backend_url}/get-measurements/${user.id}`
        );
        const { chest, waist, hips } = response.data;

        const sizeResponse = await axios.post(
          `${backend_url}/get-recommended-size`,
          {
            chest,
            waist,
            hips,
          }
        );

        const recommended = sizeResponse.data.recommended_size;
        setRecommendedSize(recommended);
        setSelectedSize(recommended); // Auto-select the recommended size
      } catch (error) {
        console.error("Error fetching recommended size:", error);
      }
    };

    fetchRecommendedSize();
  }, [user]);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={backend_url + product.image} alt="img" />
          <img src={backend_url + product.image} alt="img" />
          <img src={backend_url + product.image} alt="img" />
          <img src={backend_url + product.image} alt="img" />
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={backend_url + product.image}
            alt="img"
          />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            {currency}
            {product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            {currency}
            {product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          {product.description}
        </div>

        <div className="productdisplay-right-sizes">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              className={`size-option ${
                selectedSize === size ? "selected" : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </div>
          ))}
        </div>

        {recommendedSize && (
          <p style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>
            Recommended Size for You: {recommendedSize}
          </p>
        )}

        <button
          onClick={() => {
            if (!selectedSize) {
              alert("Please select a size");
              return;
            }
            addToCart(product.id, selectedSize);
          }}
          disabled={added}
        >
          {added ? "✔ ADDED" : "ADD TO CART"}
        </button>

        <p className="productdisplay-right-category">
          <span>Category :</span> Women, T-shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
