import React, { useState } from "react";

const ProductDetailsPage = () => {
  const [mainImage, setMainImage] = useState(
    "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=600&fit=crop"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");

  const thumbnails = [
    "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1610372410814-86f0927451cb?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&h=600&fit=crop",
  ];

  const colors = {
    green: "#2e7d32",
    lightGreen: "#66bb6a",
    accent: "#43a047",
    border: "#e0e0e0",
    white: "#ffffff",
    bg: "#f5f7fa",
    textDark: "#2c3e50",
    textLight: "#6c757d",
    red: "#e53935",
    yellow: "#ffc107",
    radius: "16px",
    shadow: "0 4px 20px rgba(0,0,0,0.08)",
    shadowHover: "0 8px 30px rgba(46,125,50,0.15)",
  };

  const styles = {
    body: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: `linear-gradient(135deg, ${colors.bg} 0%, #e8f5e9 100%)`,
      minHeight: "100vh",
    },
    header: {
      width: "100%",
      background: colors.white,
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: colors.shadow,
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logo: {
      width: "48px",
      height: "48px",
      transition: "transform 0.3s ease",
      cursor: "pointer",
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: 700,
      background: `linear-gradient(135deg, ${colors.green}, ${colors.lightGreen})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginLeft: "1rem",
    },
    searchInput: {
      padding: "0.75rem 1rem 0.75rem 3rem",
      width: "320px",
      borderRadius: "50px",
      border: `2px solid ${colors.border}`,
      fontSize: "0.95rem",
      background: colors.bg,
    },
    navbar: {
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      padding: "0.75rem 2rem",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      flexWrap: "wrap",
    },
    navItem: (active) => ({
      padding: "0.7rem 1.5rem",
      borderRadius: "50px",
      cursor: "pointer",
      fontWeight: 500,
      color: active ? colors.white : colors.textDark,
      background: active ? `linear-gradient(135deg, ${colors.green}, ${colors.accent})` : "transparent",
      boxShadow: active ? "0 4px 15px rgba(46,125,50,0.3)" : "none",
      transition: "all 0.3s ease",
    }),
    main: {
      maxWidth: "1200px",
      margin: "2rem auto",
      padding: "0 2rem 3rem",
    },
    productContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "3rem",
    },
    productImages: {
      position: "sticky",
      top: "120px",
      height: "fit-content",
    },
    mainImage: {
      width: "100%",
      aspectRatio: "1",
      borderRadius: colors.radius,
      overflow: "hidden",
      background: colors.white,
      boxShadow: colors.shadow,
      marginBottom: "1rem",
    },
    thumbnailGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "0.75rem",
    },
    thumbnail: (active) => ({
      aspectRatio: "1",
      borderRadius: "12px",
      overflow: "hidden",
      border: `2px solid ${active ? colors.green : colors.border}`,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: active ? "0 0 0 2px rgba(46,125,50,0.2)" : "none",
    }),
    productDetails: {
      background: colors.white,
      padding: "2rem",
      borderRadius: colors.radius,
      boxShadow: colors.shadow,
    },
    productBadge: {
      display: "inline-block",
      background: `linear-gradient(135deg, ${colors.green}, ${colors.accent})`,
      color: colors.white,
      padding: "0.4rem 1rem",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: 600,
      marginBottom: "1rem",
    },
    productTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      color: colors.textDark,
      marginBottom: "0.5rem",
    },
    productRating: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1.5rem",
      color: colors.yellow,
    },
    productPrice: {
      display: "flex",
      alignItems: "baseline",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    currentPrice: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: colors.green,
    },
    originalPrice: {
      fontSize: "1.3rem",
      color: colors.textLight,
      textDecoration: "line-through",
    },
    discountBadge: {
      background: colors.red,
      color: colors.white,
      padding: "0.3rem 0.8rem",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: 600,
    },
    divider: {
      height: "1px",
      background: colors.border,
      margin: "1.5rem 0",
    },
    infoSection: { marginBottom: "1.5rem" },
    infoLabel: { fontWeight: 600, color: colors.textDark, marginBottom: "0.5rem", fontSize: "0.95rem" },
    infoValue: { color: colors.textLight, lineHeight: 1.6 },
    quantitySelector: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" },
    quantityControls: { display: "flex", alignItems: "center", border: `2px solid ${colors.border}`, borderRadius: "12px", overflow: "hidden" },
    quantityBtn: { width: "40px", height: "40px", border: "none", background: colors.bg, cursor: "pointer", fontSize: "1.2rem", transition: "all 0.3s ease", color: colors.textDark },
    quantityInput: { width: "60px", height: "40px", border: "none", textAlign: "center", fontWeight: 600, fontSize: "1rem" },
    stockInfo: { color: colors.green, fontSize: "0.9rem", fontWeight: 500 },
    actionButtons: { display: "flex", gap: "1rem", marginBottom: "1.5rem" },
    btn: (primary) => ({
      flex: 1,
      padding: "1rem",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      background: primary ? `linear-gradient(135deg, ${colors.green}, ${colors.accent})` : colors.white,
      color: primary ? colors.white : colors.green,
      border: primary ? "none" : `2px solid ${colors.green}`,
      transition: "all 0.3s ease",
    }),
    sellerCard: {
      background: colors.bg,
      padding: "1.5rem",
      borderRadius: "12px",
      marginBottom: "1.5rem",
    },
    sellerHeader: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" },
    sellerAvatar: { width: "50px", height: "50px", borderRadius: "50%", background: `linear-gradient(135deg, ${colors.green}, ${colors.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: colors.white, fontSize: "1.5rem", fontWeight: 700 },
    sellerInfoName: { color: colors.textDark, marginBottom: "0.25rem" },
    sellerRating: { color: colors.textLight, fontSize: "0.85rem" },
    sellerStats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" },
    statValue: { fontWeight: 700, color: colors.green, fontSize: "1.1rem", textAlign: "center" },
    statLabel: { color: colors.textLight, fontSize: "0.8rem", textAlign: "center" },
    tabs: { background: colors.white, borderRadius: colors.radius, boxShadow: colors.shadow, overflow: "hidden" },
    tabHeaders: { display: "flex", borderBottom: `1px solid ${colors.border}` },
    tabHeader: (active) => ({
      flex: 1,
      padding: "1.2rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      color: active ? colors.green : colors.textLight,
      borderBottom: active ? `3px solid ${colors.green}` : "none",
      transition: "all 0.3s ease",
    }),
    tabContent: { padding: "2rem", display: "block", animation: "fadeIn 0.4s ease" },
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") setQuantity((prev) => Math.min(prev + 1, 100));
    else setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img style={styles.logo} src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Logo" />
          <h1 style={styles.headerTitle}>Recycle Reuse Reduce</h1>
        </div>
        <input style={styles.searchInput} type="search" placeholder="Search eco-friendly products..." />
      </header>

      {/* Navbar */}
      <nav style={styles.navbar}>
        {["Home", "Sell", "Cart", "Order", "History", "Custom", "Dashboard"].map((nav, idx) => (
          <div key={idx} style={styles.navItem(nav === "Home")}>{nav}</div>
        ))}
      </nav>

      <main style={styles.main}>
        <div style={styles.productContainer}>
          {/* Product Images */}
          <div style={styles.productImages}>
            <div style={styles.mainImage}>
              <img src={mainImage} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} />
            </div>
            <div style={styles.thumbnailGrid}>
              {thumbnails.map((thumb, idx) => (
                <div
                  key={idx}
                  style={styles.thumbnail(mainImage === thumb)}
                  onClick={() => setMainImage(thumb)}
                >
                  <img src={thumb} alt={`View ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div style={styles.productDetails}>
            <span style={styles.productBadge}>♻️ Eco-Friendly</span>
            <h1 style={styles.productTitle}>Premium Recycled Plastic Bottles</h1>
            <div style={styles.productRating}>★★★★★ <span style={{ marginLeft: "0.5rem", fontSize: "0.9rem", color: colors.textLight }}>4.8 (127 reviews)</span></div>
            <div style={styles.productPrice}>
              <span style={styles.currentPrice}>Rs. 1,000</span>
              <span style={styles.originalPrice}>Rs. 1,500</span>
              <span style={styles.discountBadge}>33% OFF</span>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.infoSection}>
              <div style={styles.infoLabel}>Description</div>
              <div style={styles.infoValue}>High-quality recycled plastic bottles, thoroughly cleaned and sanitized. Perfect for crafting, DIY projects, or industrial use. Each bottle is inspected for quality and sorted by size and condition.</div>
            </div>

            <div style={styles.quantitySelector}>
              <div style={styles.infoLabel}>Quantity:</div>
              <div style={styles.quantityControls}>
                <button style={styles.quantityBtn} onClick={() => handleQuantityChange("decrease")}>-</button>
                <input style={styles.quantityInput} type="number" value={quantity} readOnly />
                <button style={styles.quantityBtn} onClick={() => handleQuantityChange("increase")}>+</button>
              </div>
              <span style={styles.stockInfo}>✓ 250 pieces in stock</span>
            </div>

            <div style={styles.actionButtons}>
              <button style={styles.btn(false)}>🛒 Add to Cart</button>
              <button style={styles.btn(true)}>⚡ Buy Now</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <div style={styles.tabHeaders}>
            {["specifications", "reviews", "questions"].map((tab) => (
              <button
                key={tab}
                style={styles.tabHeader(activeTab === tab)}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "reviews" ? `Reviews (127)` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div style={styles.tabContent}>
            {activeTab === "specifications" && <div>Specifications content here...</div>}
            {activeTab === "reviews" && <div>Reviews content here...</div>}
            {activeTab === "questions" && <div>Q&A content here...</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;
