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
  const admin = useSelector((state) => state.complaint);

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
      // Update Redux store
      dispatch(updateComplaintStatusInStore({ id, status: "verified" }));
    } catch (err) {
      console.error("Error verifying complaint:", err);
    }
  };

  // Render all complaints
  const renderComplaints = () => {
    if (isLoading) return <p>Loading complaints...</p>;
    if (isError) return <p style={{ color: "red" }}>Error loading complaints</p>;
    if (!admin?.allComplaints?.length) return <p>No complaints found.</p>;

    return admin.allComplaints.map((c) => (
      <div
        key={c._id}
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: "#1f5520" }}>{c.title}</h3>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              ...getStatusStyle(c.status),
            }}
          >
            {c.status}
          </span>
        </div>

        {c.image && (
          <img
            src={c.image}
            alt="complaint"
            style={{
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
        )}

        <p>
          <strong>Description:</strong> {c.description}
        </p>
        <p>
          <strong>Location:</strong> {c.location}
        </p>
        <p>
          <strong>Category:</strong> {c.category}
        </p>

        <p style={{ marginTop: 10, opacity: 0.7 }}>
          <strong>Submitted By:</strong> {c?.user?.fullName} ({c?.user?.email})
        </p>

        <p style={{ opacity: 0.6 }}>
          <strong>Date:</strong> {new Date(c.createdAt).toLocaleString()}
        </p>

        {/* Verify button */}
        {c.status === "pending" && (
          <button
            onClick={() => handleVerify(c._id)}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Verify
          </button>
        )}
      </div>
    ));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: '"Segoe UI", sans-serif' }}>
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} isMobile={isMobile} />
      <main style={{ flex: 1, padding: isMobile ? "70px 24px 24px" : "40px 50px", overflowY: "auto" }}>
        {activeMenu === "View Complaints" && renderComplaints()}
      </main>
    </div>
  );
}
