import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../Assets/logo_image.png";
import cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";
import BodyScanModal from "../BodyScanModal/BodyScanModal";
import BodyShapeForm from "../BodyShapeForm/BodyShapeForm";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [showShapeForm, setShowShapeForm] = useState(false);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="nav">
      <Link
        to="/"
        onClick={() => setMenu("shop")}
        style={{ textDecoration: "none" }}
        className="nav-logo"
      >
        <img
          src={logo}
          alt="ShopSphere Logo"
          style={{ width: "200px", backgroundColor: "transparent" }}
        />
      </Link>

      <img
        onClick={dropdown_toggle}
        className="nav-dropdown"
        src={nav_dropdown}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link to="/">Home</Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link to="/mens">Men</Link>
          {menu === "mens" && <hr />}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link to="/womens">Women</Link>
          {menu === "womens" && <hr />}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link to="/kids">Kids</Link>
          {menu === "kids" && <hr />}
        </li>
        <li className="nav-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                type="button"
                className="search-button"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-camera"></i>
              </button>
              <button
                type="button"
                className="shape-button"
                onClick={() => setShowShapeForm(true)}
              >
                Know your shape
              </button>
            </div>
          </form>
        </li>
      </ul>

      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("auth-token");
              localStorage.removeItem("user-id");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>

      {/* Camera Modal */}
      {showModal && <BodyScanModal onClose={() => setShowModal(false)} />}

      {/* Body Shape Modal */}
      {showShapeForm && (
        <div className="body-scan-overlay">
          <div className="body-scan-modal">
            <IoMdClose
              className="modal-close-icon"
              onClick={() => setShowShapeForm(false)}
            />
            <BodyShapeForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
