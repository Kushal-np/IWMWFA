import React, { useState } from "react";

const statsData = [
  { icon: "📦", label: "Total Purchased", value: 24, subtext: "Rs. 15,850 spent" },
  { icon: "💰", label: "Total Sold", value: 18, subtext: "Rs. 12,400 earned" },
  { icon: "♻️", label: "Items Recycled", value: 42, subtext: "Environmental impact" },
  { icon: "❌", label: "Cancelled", value: 3, subtext: "7% cancellation rate" },
];

const historyData = [
  {
    id: "#RRR-2024-1847",
    type: "bought",
    date: "Nov 18, 2025",
    items: [
      {
        title: "Recycled Plastic Bottles",
        qty: 50,
        category: "Plastic Materials",
        price: 1000,
        partnerName: "EcoSupply Co.",
        partnerAvatar: "ES",
        delivered: "Nov 22, 2025",
      },
    ],
  },
  {
    id: "#RRR-2024-1842",
    type: "sold",
    date: "Nov 16, 2025",
    items: [
      {
        title: "Metal Scrap Bundle",
        qty: 10,
        category: "Metal Scrap",
        price: 1500,
        partnerName: "RecycleIndia Ltd.",
        partnerAvatar: "RI",
        delivered: "Nov 20, 2025",
      },
    ],
  },
  {
    id: "#RRR-2024-1835",
    type: "bought",
    date: "Nov 12, 2025",
    items: [
      {
        title: "Recycled Paper Stack",
        qty: 500,
        category: "Paper Products",
        price: 450,
        partnerName: "GreenPaper Co.",
        partnerAvatar: "GP",
        delivered: "Nov 15, 2025",
      },
    ],
  },
];

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredHistory =
    activeTab === "All"
      ? historyData
      : historyData.filter((txn) => txn.type.toLowerCase() === activeTab.toLowerCase());

  const colors = {
    green: "#2e7d32",
    lightGreen: "#66bb6a",
    blue: "#2196f3",
    red: "#e53935",
    bg: "#f5f7fa",
    white: "#ffffff",
    textDark: "#2c3e50",
    textLight: "#6c757d",
    border: "#e0e0e0",
  };

  const styles = {
    body: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: `linear-gradient(135deg, ${colors.bg} 0%, #e8f5e9 100%)`,
      minHeight: "100vh",
      margin: 0,
      padding: 0,
    },
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
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
    logoHover: {
      transform: "rotate(360deg) scale(1.1)",
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
      transition: "all 0.3s ease",
    },
    navbar: {
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem 2rem",
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    navItem: (active) => ({
      padding: "0.7rem 1.5rem",
      borderRadius: "50px",
      cursor: "pointer",
      fontWeight: 500,
      color: active ? colors.white : colors.textDark,
      background: active ? `linear-gradient(135deg, ${colors.green}, #43a047)` : "transparent",
      boxShadow: active ? `0 4px 15px rgba(46,125,50,0.3)` : "none",
      transition: "all 0.3s ease",
    }),
    main: {
      maxWidth: "1200px",
      margin: "2rem auto",
      padding: "0 2rem",
    },
    sectionTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      color: colors.textDark,
      marginBottom: "2rem",
      position: "relative",
      display: "inline-block",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    statCard: {
      background: colors.white,
      padding: "1.5rem",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
    },
    statIcon: {
      fontSize: "1.5rem",
      marginBottom: "1rem",
    },
    filterTabs: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "2rem",
      flexWrap: "wrap",
    },
    filterTab: (active) => ({
      padding: "0.7rem 1.5rem",
      borderRadius: "50px",
      cursor: "pointer",
      fontWeight: 500,
      color: active ? colors.white : colors.textDark,
      background: active ? `linear-gradient(135deg, ${colors.green}, #43a047)` : colors.bg,
      boxShadow: active ? "0 2px 10px rgba(46,125,50,0.3)" : "none",
      transition: "all 0.3s ease",
    }),
    historyCard: (type) => {
      let borderColor = type === "bought" ? colors.blue : type === "sold" ? colors.green : colors.red;
      return {
        background: colors.white,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderLeft: `4px solid ${borderColor}`,
        marginBottom: "1.5rem",
      };
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 1.5rem",
      background: colors.bg,
      borderBottom: `1px solid ${colors.border}`,
    },
    cardBody: { padding: "1.5rem" },
    transactionItem: {
      display: "flex",
      gap: "1.5rem",
      marginBottom: "1.5rem",
    },
    itemImage: {
      width: "100px",
      height: "100px",
      borderRadius: "12px",
      objectFit: "cover",
      background: colors.bg,
    },
    itemDetails: { flex: 1 },
    itemTitle: { fontWeight: 600, color: colors.textDark, marginBottom: "0.5rem", fontSize: "1.1rem" },
    itemMeta: { display: "flex", gap: "1rem", marginBottom: "0.75rem", color: colors.textLight },
    itemPrice: (cancelled) => ({
      fontSize: "1.3rem",
      fontWeight: 700,
      color: cancelled ? colors.red : colors.green,
      textDecoration: cancelled ? "line-through" : "none",
    }),
    partnerInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "0.5rem",
      padding: "0.75rem",
      background: colors.bg,
      borderRadius: "8px",
      width: "fit-content",
    },
    partnerAvatar: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${colors.green}, #43a047)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.white,
      fontWeight: 700,
      fontSize: "0.8rem",
    },
    cardFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 1.5rem",
      background: colors.bg,
      borderTop: `1px solid ${colors.border}`,
      flexWrap: "wrap",
      gap: "1rem",
    },
    statusBadge: (type) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.9rem",
      fontWeight: 600,
      background: type === "cancelled" ? "#ffebee" : "#e8f5e9",
      color: type === "cancelled" ? colors.red : colors.green,
    }),
    btn: (primary) => ({
      padding: "0.6rem 1.2rem",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "0.9rem",
      background: primary ? `linear-gradient(135deg, ${colors.green}, #43a047)` : colors.white,
      color: primary ? colors.white : colors.textDark,
      border: primary ? "none" : `2px solid ${colors.border}`,
    }),
  };

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" style={styles.logo} alt="Logo" />
          <h1 style={styles.headerTitle}>Recycle Reuse Reduce</h1>
        </div>
        <div>
          <input type="search" placeholder="Search eco-friendly products..." style={styles.searchInput} />
        </div>
      </header>

      {/* Navbar */}
      <nav style={styles.navbar}>
        {["Home", "Sell", "Cart", "Order", "History", "Custom", "Dashboard"].map((navItem) => (
          <div key={navItem} style={styles.navItem(navItem === "History")}>
            {navItem}
          </div>
        ))}
      </nav>

      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Transaction History</h2>

        {/* Stats */}
        <div style={styles.statsContainer}>
          {statsData.map((stat, idx) => (
            <div key={idx} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div>{stat.label}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: colors.textLight, fontSize: "0.85rem", marginTop: "0.25rem" }}>
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {["All", "Bought", "Sold", "Cancelled"].map((tab) => (
            <button
              key={tab}
              style={styles.filterTab(activeTab === tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* History List */}
        <div>
          {filteredHistory.map((txn) => (
            <div key={txn.id} style={styles.historyCard(txn.type)}>
              <div style={styles.cardHeader}>
                <span>{txn.id}</span>
                <span
                  style={{
                    padding: "0.3rem 0.8rem",
                    borderRadius: "20px",
                    fontWeight: 600,
                    background:
                      txn.type === "bought"
                        ? "linear-gradient(135deg, #e3f2fd, #90caf9)"
                        : txn.type === "sold"
                        ? "linear-gradient(135deg, #e8f5e9, #81c784)"
                        : "linear-gradient(135deg, #ffebee, #e57373)",
                    color: txn.type === "bought" ? "#0d47a1" : txn.type === "sold" ? "#1b5e20" : "#c62828",
                  }}
                >
                  {txn.type.toUpperCase()}
                </span>
                <span style={{ color: colors.textLight }}>{txn.date}</span>
              </div>

              <div style={styles.cardBody}>
                {txn.items.map((item, idx) => (
                  <div key={idx} style={styles.transactionItem}>
                    <img src="https://via.placeholder.com/100" alt={item.title} style={styles.itemImage} />
                    <div style={styles.itemDetails}>
                      <div style={styles.itemTitle}>{item.title}</div>
                      <div style={styles.itemMeta}>
                        Qty: {item.qty} | {item.category}
                      </div>
                      <div style={styles.itemPrice(txn.type === "cancelled")}>Rs. {item.price}</div>
                      <div style={styles.partnerInfo}>
                        <div style={styles.partnerAvatar}>{item.partnerAvatar}</div>
                        <span>{txn.type === "sold" ? "Buyer" : "Seller"}: {item.partnerName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.statusBadge(txn.type)}>{txn.type === "cancelled" ? "Cancelled" : "Completed"}</span>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button style={styles.btn(txn.type !== "cancelled")}>View Details</button>
                  {txn.type !== "cancelled" && <button style={styles.btn(false)}>Invoice</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
