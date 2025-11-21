import React, { useState } from "react";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Recycled Plastic Bottles",
      description: "Clean, sorted plastic bottles ready for recycling",
      price: 20,
      quantity: 5,
      image:
        "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=200&h=200&fit=crop",
      inStock: true,
      selected: true,
    },
    {
      id: 2,
      name: "Used Cardboard Box",
      description: "Sturdy cardboard boxes, perfect for repurposing",
      price: 10,
      quantity: 10,
      image:
        "https://images.unsplash.com/photo-1580913428706-c311e67898b3?w=200&h=200&fit=crop",
      inStock: true,
      selected: true,
    },
    {
      id: 3,
      name: "Metal Scrap Bundle",
      description: "High-quality metal scraps sorted by type",
      price: 150,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1609424246634-00ed16e1d6b4?w=200&h=200&fit=crop",
      inStock: true,
      selected: true,
    },
    {
      id: 4,
      name: "Reused Glass Containers",
      description: "Clean glass jars and bottles for reuse",
      price: 40,
      quantity: 3,
      image:
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&h=200&fit=crop",
      inStock: true,
      selected: true,
    },
  ]);

  const [notification, setNotification] = useState(null);
  const [promoCode, setPromoCode] = useState("");

  const SHIPPING_FEE = 50;
  const TAX_RATE = 0.13;
  const ECO_DISCOUNT_RATE = 0.05;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleItemSelection = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const removeItem = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (window.confirm(`Remove ${item.name} from cart?`)) {
      setCartItems(cartItems.filter((i) => i.id !== itemId));
      showNotification(`${item.name} removed from cart`, "danger");
    }
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      setCartItems([]);
      showNotification("Cart cleared", "danger");
    }
  };

  const applyPromoCode = () => {
    const validCodes = {
      ECO10: 0.1,
      GREEN15: 0.15,
      SAVE20: 0.2,
    };
    const code = promoCode.trim().toUpperCase();
    if (validCodes[code]) {
      const discount = validCodes[code];
      showNotification(`Promo code applied! ${discount * 100}% off`, "success");
      setPromoCode("");
    } else if (code === "") {
      showNotification("Please enter a promo code", "warning");
    } else {
      showNotification("Invalid promo code", "danger");
    }
  };

  const proceedToCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      showNotification("Please select items to checkout", "warning");
      return;
    }
    showNotification("Proceeding to checkout...", "success");
    setTimeout(() => {
      alert(
        "Redirecting to checkout page...\n\nSelected items: " +
          selectedItems.length
      );
    }, 500);
  };

  const calculateSummary = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const ecoDiscount = subtotal * ECO_DISCOUNT_RATE;
    const total = subtotal + SHIPPING_FEE + tax - ecoDiscount;
    const wastesSaved = (selectedItems.length * 0.625).toFixed(1);
    return {
      subtotal,
      tax,
      ecoDiscount,
      total,
      wastesSaved,
      itemCount: selectedItems.length,
    };
  };

  const summary = calculateSummary();

  // Styles
  const rootStyle = {
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(135deg,#f5f7fa,#e8f5e9)",
    minHeight: "100vh",
    paddingBottom: "4rem",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const logoStyle = {
    width: "48px",
    height: "48px",
    cursor: "pointer",
    transition: "transform 0.3s",
  };

  const headerTitleStyle = {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginLeft: "1rem",
    background: "linear-gradient(90deg,#2e7d32,#43a047)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const searchInputStyle = {
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    width: "280px",
    borderRadius: "50px",
    border: "2px solid #ccc",
    fontSize: "0.95rem",
    outline: "none",
    background: "#f5f7fa",
  };

  const navStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    background: "#fff",
    padding: "0.75rem 0",
    borderBottom: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const navItemStyle = (active) => ({
    padding: "0.6rem 1.5rem",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: 500,
    color: active ? "#fff" : "#2c3e50",
    background: active
      ? "linear-gradient(135deg,#2e7d32,#43a047)"
      : "transparent",
    boxShadow: active ? "0 4px 15px rgba(46,125,50,0.3)" : "none",
    transition: "all 0.3s ease",
  });

  const mainStyle = {
    maxWidth: "1200px",
    margin: "2rem auto",
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  };

  const cartItemsStyle = {
    flex: "2",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  const cartItemStyle = {
    display: "grid",
    gridTemplateColumns: "auto 80px 2fr 120px 120px auto",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "20px",
    transition: "all 0.3s",
  };

  const imgWrapperStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "15px",
    overflow: "hidden",
    background: "#f5f7fa",
  };

  const summaryStyle = {
    flex: "1",
    background: "#fff",
    borderRadius: "20px",
    padding: "2rem",
    height: "fit-content",
    position: "sticky",
    top: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s",
  };

  return (
    <div style={rootStyle}>
      {/* Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "2rem",
            right: "2rem",
            padding: "1rem 2rem",
            borderRadius: "15px",
            color: "#fff",
            background:
              notification.type === "success"
                ? "#2e7d32"
                : notification.type === "danger"
                ? "#c62828"
                : "#f9a825",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            fontWeight: "600",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Logo"
            style={logoStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "rotate(360deg) scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
          />
          <h1 style={headerTitleStyle}>Recycle Reuse Reduce</h1>
        </div>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
            }}
          >
            🔍
          </span>
          <input
            type="search"
            placeholder="Search eco-friendly products..."
            style={searchInputStyle}
          />
        </div>
      </header>

      {/* Navbar */}
      <nav style={navStyle}>
        {[
          "🏠 Home",
          "💰 Sell",
          "🛒 Cart",
          "📦 Order",
          "📜 History",
          "✨ Custom",
          "📊 Dashboard",
        ].map((item, idx) => (
          <div key={idx} style={navItemStyle(item === "🛒 Cart")}>
            {item}
          </div>
        ))}
      </nav>

      {/* Main */}
      <main style={mainStyle}>
        {/* Cart Items */}
        <div style={cartItemsStyle}>
          {cartItems.map((item) => (
            <div key={item.id} style={cartItemStyle}>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleItemSelection(item.id)}
              />
              <div style={imgWrapperStyle}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#555" }}>
                  {item.description}
                </p>
              </div>
              <div>
                <span style={{ fontWeight: "600" }}>{item.quantity}</span>
              </div>
              <div style={{ textAlign: "right", fontWeight: "600" }}>
                Rs. {item.price * item.quantity}
                <div style={{ fontSize: "0.75rem", fontWeight: "400" }}>
                  Rs. {item.price} each
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: "#ffe5e5",
                  borderRadius: "10px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#c62828")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#ffe5e5")
                }
              >
                🗑️
              </button>
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <button
              style={{
                ...buttonStyle,
                background: "#f5f5f5",
                border: "2px solid #ccc",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderColor = "#2e7d32")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.borderColor = "#ccc")
              }
            >
              ← Continue Shopping
            </button>
            <button
              style={{ ...buttonStyle, background: "#ffe5e5", color: "#c62828" }}
              onClick={clearCart}
              onMouseOver={(e) => (e.currentTarget.style.background = "#c62828", e.currentTarget.style.color = "#fff")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#ffe5e5", e.currentTarget.style.color = "#c62828")}
            >
              🗑️ Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div style={summaryStyle}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>Subtotal ({summary.itemCount} items)</span>
            <span>Rs. {summary.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>Shipping Fee</span>
            <span>Rs. {SHIPPING_FEE}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>Tax (13%)</span>
            <span>Rs. {summary.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "#f57c00", fontWeight: 600 }}>
            <span>Eco Discount (-5%)</span>
            <span>- Rs. {summary.ecoDiscount.toFixed(2)}</span>
          </div>

          {/* Promo */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && applyPromoCode()}
              style={{ flex: 1, padding: "0.5rem", borderRadius: "10px", border: "2px solid #ccc" }}
            />
            <button
              onClick={applyPromoCode}
              style={{
                ...buttonStyle,
                background: "#2e7d32",
                color: "#fff",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#43a047")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#2e7d32")}
            >
              Apply
            </button>
          </div>

          {/* Checkout */}
          <button
            onClick={proceedToCheckout}
            style={{
              ...buttonStyle,
              width: "100%",
              background: "linear-gradient(135deg,#2e7d32,#43a047)",
              color: "#fff",
              fontSize: "1rem",
              marginBottom: "1rem",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(135deg,#43a047,#66bb6a)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(135deg,#2e7d32,#43a047)")}
          >
            Proceed to Checkout →
          </button>

          {/* Eco Impact */}
          <div style={{ display: "flex", gap: "1rem", padding: "1rem", borderRadius: "15px", background: "linear-gradient(135deg,#e8f5e9,#f1f8e9)" }}>
            <div style={{ fontSize: "1.5rem" }}>🌱</div>
            <div>
              <div style={{ fontWeight: 600, color: "#2e7d32" }}>Eco Impact</div>
              <p style={{ fontSize: "0.85rem", color: "#555" }}>
                Your purchase saves {summary.wastesSaved}kg of waste from landfills!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;
