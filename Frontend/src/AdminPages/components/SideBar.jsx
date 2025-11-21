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
    { name: "Logout", route: "/logout" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigation = (route) => {
    setActiveMenu(route);
    setIsSidebarOpen(false);
    navigate(route);
  };

  const sidebarStyle = {
    position: isMobile ? "fixed" : "static",
    top: 0,
    left: 0,
    bottom: 0,
    width: "250px",
    background: "linear-gradient(180deg, #2f6b2f 0%, #25592b 100%)",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
    zIndex: 40,
    transform: isMobile ? (isSidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
    transition: "transform 0.3s ease-in-out",
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 50,
            padding: "8px 12px",
            background: "#2f6b2f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      )}

      {isSidebarOpen && isMobile && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 30,
          }}
        />
      )}

      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 700 }}>Admin Panel</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {menuItems.map((item, i) => (
            <li key={i}>
              <div
                onClick={() => handleNavigation(item.route)}
                style={{
                  color: item.name === "Logout" ? "#ffdddd" : "white",
                  textDecoration: "none",
                  display: "block",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  opacity: activeMenu === item.route ? 1 : 0.85,
                  background: activeMenu === item.route && item.name !== "Logout" ? "rgba(255,255,255,0.1)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {item.name}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default SideBar;
