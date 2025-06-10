import React, { useContext, useState } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import logo from "../Assets/logo_image.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CartItems = () => {
  const {
    products,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    addToCart,
    decreaseCartItem,
  } = useContext(ShopContext);

  const [userData] = useState({
    name: "Customer Name",
    email: "customer@example.com",
    phone: "1234567890",
    address: "123 Sample Street, City, Country",
  });

  const handleCheckout = () => {
    // Open a new blank window/tab
    const newWindow = window.open("", "_blank", "width=600,height=600");

    if (newWindow) {
      const docPDF = new jsPDF();
      const img = new Image();
      img.src = logo;

      img.onload = () => {
        docPDF.addImage(img, "PNG", 85, 10, 40, 15);
        generatePDFContent(docPDF);
      };

      const generatePDFContent = (docPDF) => {
        docPDF.setFontSize(12);
        docPDF.setTextColor(40);
        docPDF.setFont("helvetica", "normal");

        docPDF.text("Customer Details", 14, 35);
        docPDF.text(`Name: ${userData.name}`, 14, 42);
        docPDF.text(`Email: ${userData.email}`, 14, 48);
        docPDF.text(`Phone: ${userData.phone}`, 14, 54);
        docPDF.text(`Address: ${userData.address}`, 14, 60);

        docPDF.text(
          `Invoice Date: ${new Date().toLocaleDateString()}`,
          200,
          42,
          { align: "right" }
        );
        docPDF.text(
          `Invoice #: INV-${Math.floor(Math.random() * 900000)}`,
          200,
          48,
          { align: "right" }
        );

        const invoiceItems = products
          .filter((e) => cartItems[e.id]?.quantity > 0)
          .map((e) => [
            e.name,
            cartItems[e.id]?.size || "-",
            `INR ${e.new_price.toFixed(2)}`,
            cartItems[e.id]?.quantity,
            `INR ${(e.new_price * cartItems[e.id]?.quantity).toFixed(2)}`,
          ]);

        autoTable(docPDF, {
          head: [["Product", "Size", "Unit Price", "Quantity", "Total"]],
          body: invoiceItems,
          startY: 70,
          theme: "striped",
          headStyles: {
            fillColor: [22, 160, 133],
            textColor: 255,
            fontSize: 10,
          },
          bodyStyles: {
            fontSize: 10,
          },
          columnStyles: {
            0: { cellWidth: 55 },
            1: { cellWidth: 25, halign: "center" },
            2: { cellWidth: 30, halign: "right" },
            3: { cellWidth: 25, halign: "center" },
            4: { cellWidth: 30, halign: "right" },
          },
        });

        const finalY = docPDF.lastAutoTable.finalY;

        docPDF.setFont("helvetica", "bold");
        docPDF.setFontSize(12);
        docPDF.text(
          `Grand Total: INR ${getTotalCartAmount().toFixed(2)}`,
          200,
          finalY + 10,
          {
            align: "right",
          }
        );

        docPDF.setFont("helvetica", "normal");
        docPDF.setFontSize(11);
        docPDF.text(
          "Thank you for shopping with ShopSphere!",
          105,
          finalY + 25,
          {
            align: "center",
          }
        );

        docPDF.setFontSize(9);
        docPDF.setTextColor(100);
        docPDF.text("Follow us on:", 105, finalY + 34, { align: "center" });
        docPDF.text("Instagram | Twitter | Facebook", 105, finalY + 41, {
          align: "center",
        });

        // Write the HTML content into the new window
        newWindow.document.write(`
          <html>
            <head><title>Payment Options</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px;">
              <div style="border: 2px solid #ddd; padding: 20px; width: 80%; margin: 0 auto; border-radius: 10px; background-color: #f9f9f9;">
                <h1>Choose Your Payment Method</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Please select a payment option below to complete your purchase:</p>
                <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 15px;">
                  <button style="padding: 10px 20px; font-size: 16px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Credit Card</button>
                  <button style="padding: 10px 20px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Debit Card</button>
                  <button style="padding: 10px 20px; font-size: 16px; background-color: #ff9900; color: white; border: none; border-radius: 5px; cursor: pointer;">PayPal</button>
                  <button style="padding: 10px 20px; font-size: 16px; background-color: #34b7f1; color: white; border: none; border-radius: 5px; cursor: pointer;">Google Pay</button>
                  <button style="padding: 10px 20px; font-size: 16px; background-color: #000; color: white; border: none; border-radius: 5px; cursor: pointer;">Apple Pay</button>
                </div>
                <button id="downloadInvoiceBtn" style="padding: 10px 20px; margin-top: 20px; font-size: 16px; background-color: #ff5733; color: white; border: none; border-radius: 5px; cursor: pointer;">Download Invoice</button>
              </div>
              <hr>
              <p>Secure Payment: All transactions are encrypted and protected.</p>
            </body>
          </html>
        `);

        // Attach event listener for the Download Invoice button after document is fully loaded
        newWindow.document
          .getElementById("downloadInvoiceBtn")
          .addEventListener("click", () => {
            docPDF.save("ShopSphere_Invoice.pdf");
          });

        newWindow.document.close();
      };
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Size</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((e) => {
        if (cartItems[e.id]?.quantity > 0) {
          return (
            <div className="cartitems-format-main cartitems-format" key={e.id}>
              <img
                className="cartitems-product-icon"
                src={backend_url + e.image}
                alt=""
              />
              <p>{e.name}</p>
              <p>
                {currency}
                {e.new_price}
              </p>
              <p>{cartItems[e.id]?.size || "-"}</p>
              <div className="cartitems-quantity-controls">
                <button onClick={() => decreaseCartItem(e.id)}>-</button>
                <span>{cartItems[e.id]?.quantity}</span>
                <button onClick={() => addToCart(e.id, cartItems[e.id]?.size)}>
                  +
                </button>
              </div>
              <p>
                {currency}
                {e.new_price * (cartItems[e.id]?.quantity || 0)}
              </p>
              <img
                onClick={() => removeFromCart(e.id)}
                className="cartitems-remove-icon"
                src={cross_icon}
                alt="Remove"
              />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>
                {currency}
                {getTotalCartAmount()}
              </h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
