import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Analytics", route: "/admin/dashboard" },
    { name: "View Complaints", route: "/admin/Crequest" },
    { name: "Manage Pickups", route: "/admin/request" },
    { name: "Reports", route: "/admin/reports" },
    { name: "Settings", route: "/admin/settings" },
    { name: "Go Back", route: "/logout" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update active menu when location changes
  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (route) => {
    setActiveMenu(route);
    setIsSidebarOpen(false);
    navigate(route);
  };

  const styles = {
    // Container wrapper to prevent parent interference
    sidebarWrapper: {
      position: isMobile ? "fixed" : "relative",
      top: 0,
      left: 0,
      height: isMobile ? "100vh" : "auto",
      zIndex: 1000,
      margin: 0,
      padding: 0,
    },
    sidebar: {
      position: isMobile ? "fixed" : "sticky",
      top: 0,
      left: 0,
      height: "100vh",
      width: "260px",
      minWidth: "260px",
      maxWidth: "260px",
      background: "linear-gradient(180deg, #2f6b2f 0%, #1f4f1f 100%)",
      color: "white",
      padding: "0",
      margin: 0,
      display: "flex",
      flexDirection: "column",
      boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
      zIndex: 1000,
      transform: isMobile ? (isSidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflowY: "auto",
      overflowX: "hidden",
      boxSizing: "border-box",
    },
    header: {
      padding: "32px 24px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      margin: 0,
      boxSizing: "border-box",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: 700,
      margin: 0,
      padding: 0,
      letterSpacing: "0.5px",
      lineHeight: 1.2,
    },
    menuContainer: {
      flex: 1,
      padding: "24px 16px",
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      boxSizing: "border-box",
      overflowY: "auto",
    },
    menuList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    menuItem: {
      margin: 0,
      padding: 0,
    },
    menuButton: (isActive, isLogout) => ({
      width: "100%",
      color: isLogout ? "#fecaca" : "white",
      textDecoration: "none",
      display: "block",
      padding: "14px 16px",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: 500,
      opacity: isActive ? 1 : 0.85,
      background: isActive && !isLogout 
        ? "rgba(255, 255, 255, 0.15)" 
        : "transparent",
      cursor: "pointer",
      transition: "all 0.2s ease",
      border: "none",
      textAlign: "left",
      boxSizing: "border-box",
      margin: 0,
      outline: "none",
      letterSpacing: "0.3px",
    }),
    mobileToggle: {
      position: "fixed",
      top: "20px",
      left: "20px",
      zIndex: 1100,
      padding: "12px 16px",
      background: "#2f6b2f",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: 600,
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "48px",
      height: "48px",
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
      backdropFilter: "blur(2px)",
    },
    footer: {
      padding: "20px 24px",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      fontSize: "0.85rem",
      opacity: 0.7,
      textAlign: "center",
      margin: 0,
    },
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={styles.mobileToggle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div onClick={() => setIsSidebarOpen(false)} style={styles.overlay} />
      )}

      {/* Sidebar */}
      <div style={styles.sidebarWrapper}>
        <aside style={styles.sidebar}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Admin Panel</h2>
          </div>

          {/* Menu Items */}
          <nav style={styles.menuContainer}>
            <ul style={styles.menuList}>
              {menuItems.map((item, i) => {
                const isActive = activeMenu === item.route;
                const isLogout = item.name === "Logout";
                
                return (
                  <li key={i} style={styles.menuItem}>
                    <button
                      onClick={() => handleNavigation(item.route)}
                      style={styles.menuButton(isActive, isLogout)}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.opacity = "0.85";
                          e.currentTarget.style.transform = "translateX(0)";
                        }
                      }}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div style={styles.footer}>
            © 2025 Admin Panel
          </div>
        </aside>
      </div>
    </>
  );
};

export default SideBar;