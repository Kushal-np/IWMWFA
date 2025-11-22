import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllComplaints } from "../../api/adminApi";

import { setAllComplaints, updateComplaintStatusInStore } from "../../store/complaintSlice";
import SideBar from "../components/SideBar";
import { updateComplaintStatus } from "../../api/complaint";

export default function ViewComplainRequests() {
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState("View Complaints");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const admin = useSelector((state) => state.complaint);
  
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);
  
  // Fetch complaints
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allComplaints"],
    queryFn: getAllComplaints,
  });

  useEffect(() => {
    if (data?.complaints) {
      dispatch(setAllComplaints(data.complaints));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) console.log("QUERY ERROR:", error);
  }, [isError, error]);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Status styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white" };
      case "verified":
        return { background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white" };
      case "resolved":
        return { background: "linear-gradient(135deg, #2f6b2f, #3a7d3a)", color: "white" };
      default:
        return { background: "#999", color: "white" };
    }
  };

  // Handle Verify button click
  const handleVerify = async (id) => {
    try {
      const response = await updateComplaintStatus(id, "verified");
      dispatch(updateComplaintStatusInStore({ id, status: "verified" }));
      alert("Complaint verified successfully!");
    } catch (err) {
      console.error("Error verifying complaint:", err);
      alert("Failed to verify complaint");
    }
  };

  // Render all complaints
  const renderComplaints = () => {
    if (isLoading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <p style={{ fontSize: "1.2rem", color: "#64748b" }}>Loading complaints...</p>
          </div>
        </div>
      );
    }
    
    if (isError) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <p style={{ color: "#ef4444", fontSize: "1.2rem" }}>Error loading complaints</p>
          </div>
        </div>
      );
    }
    
    if (!admin?.allComplaints?.length) {
      return (
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh",
          background: "white",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📋</div>
          <h3 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "0.5rem" }}>No Complaints Found</h3>
          <p style={{ color: "#64748b" }}>There are currently no complaints to display.</p>
        </div>
      );
    }

    return admin.allComplaints.map((c) => (
      <div
        key={c._id}
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
          border: "1px solid #e5e7eb",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        }}
      >
        {/* Header with Title and Status */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          marginBottom: "20px",
          gap: "16px"
        }}>
          <h3 style={{ 
            margin: 0, 
            color: "#1e293b", 
            fontSize: "1.35rem", 
            fontWeight: 700,
            flex: 1,
            lineHeight: 1.4
          }}>
            {c.title}
          </h3>
          <span
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              ...getStatusStyle(c.status),
            }}
          >
            {c.status}
          </span>
        </div>

        {/* Image Section - Improved */}
        {c.image && (
          <div 
            style={{
              width: "100%",
              height: "400px",
              marginBottom: "20px",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#f8fafc",
              border: "2px solid #e5e7eb",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => setSelectedImage(c.image)}
          >
            <img
              src={c.image}
              alt={c.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
            <div style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              backdropFilter: "blur(4px)",
            }}>
              🔍 Click to enlarge
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px",
          marginBottom: "20px",
          padding: "20px",
          background: "#f8fafc",
          borderRadius: "12px"
        }}>
          <div>
            <p style={{ 
              margin: 0,
              color: "#475569", 
              lineHeight: "1.7",
              fontSize: "0.95rem"
            }}>
              <strong style={{ color: "#1e293b", display: "block", marginBottom: "6px" }}>📝 Description:</strong>
              {c.description}
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>
                <strong style={{ color: "#1e293b", display: "block", marginBottom: "4px" }}>📍 Location:</strong>
                {c.location}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>
                <strong style={{ color: "#1e293b", display: "block", marginBottom: "4px" }}>🏷️ Category:</strong>
                {c.category}
              </p>
            </div>
          </div>
        </div>

        {/* User Info Footer */}
        <div style={{ 
          borderTop: "2px solid #e5e7eb", 
          paddingTop: "16px", 
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div>
            <p style={{ margin: "0 0 6px 0", color: "#64748b", fontSize: "0.9rem" }}>
              <strong style={{ color: "#475569" }}>👤 Submitted By:</strong> {c?.user?.fullName}
            </p>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
              <strong>📧</strong> {c?.user?.email}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
              <strong>🕒 Date:</strong> {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {c.status === "pending" && (
            <button
              onClick={() => handleVerify(c._id)}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
              }}
            >
              ✓ Verify Complaint
            </button>
          )}
          {c.status === "verified" && (
            <button
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2f6b2f, #1f5520)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.95rem",
                boxShadow: "0 4px 12px rgba(47, 107, 47, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ✓ Verified
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Image Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div style={{ display: "flex", minHeight: "100vh", fontFamily: '"Segoe UI", sans-serif', background: "#f3f4f6" }}>
        <SideBar />
        <main style={{ flex: 1, padding: isMobile ? "70px 24px 24px" : "40px 50px", overflowY: "auto" }}>
          <header style={{ marginBottom: "30px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
              📋 View Complaints
            </h1>
            <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1rem" }}>
              Manage and review all submitted complaints
            </p>
          </header>
          {renderComplaints()}
        </main>
      </div>
    </>
  );
}