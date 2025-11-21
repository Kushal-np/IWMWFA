import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllComplaints } from "../../api/adminApi";
import { setAllComplaints } from "../../store/adminSlice";
import SideBar from "../components/SideBar"; // import the reusable sidebar

export default function ViewComplainRequests() {
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState("View Complaints");
  const admin = useSelector((state) => state.admin);

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

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white" };
      case "in-progress":
        return { background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white" };
      case "resolved":
        return { background: "linear-gradient(135deg, #2f6b2f, #3a7d3a)", color: "white" };
      case "rejected":
        return { background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white" };
      default:
        return { background: "#999", color: "white" };
    }
  };

  const renderComplaints = () => (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "6px", color: "#1f5520" }}>
        All Complaints
      </h1>
      <p style={{ opacity: 0.6, marginBottom: "25px", color: "#2f6b2f" }}>
        View and manage all submitted complaints from users
      </p>

      {isLoading && <p>Loading complaints...</p>}
      {isError && <p style={{ color: "red" }}>Error loading complaints</p>}
      {!isLoading && !admin?.complaints?.length && <p>No complaints found.</p>}

      {admin?.complaints?.map((c) => (
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: 10,
            }}
          >
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
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: '"Segoe UI", sans-serif',
        background: "linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)",
      }}
    >
      <SideBar /> {/* Reusable sidebar */}
      <main style={{ flex: 1, padding: "40px 50px", overflowY: "auto" }}>
        {activeMenu === "View Complaints" && renderComplaints()}
      </main>
    </div>
  );
}
