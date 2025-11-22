import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setAllPickupRequests } from "../../store/adminSlice";
import { getAllPickupRequest } from "../../api/adminApi";
import SideBar from "../components/SideBar";

export default function ViewPickupRequests() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const admin = useSelector((state) => state.admin);
  const [activeMenu, setActiveMenu] = useState("View All Requests");
  const [isMobile, setIsMobile] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allPickups"],
    queryFn: getAllPickupRequest,
  });

  useEffect(() => {
    if (data?.pickupRequests) {
      console.log("ALL PICKUP REQUESTS:", data.pickupRequests);
      dispatch(setAllPickupRequests(data.pickupRequests));
    }
  }, [data, dispatch]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          icon: "⏳",
        };
      case "in-progress":
        return {
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          color: "white",
          icon: "🚚",
        };
      case "completed":
        return {
          background: "linear-gradient(135deg, #2f6b2f, #3a7d3a)",
          color: "white",
          icon: "✅",
        };
      case "cancelled":
        return {
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "white",
          icon: "❌",
        };
      default:
        return { background: "#999", color: "white", icon: "📋" };
    }
  };

  const getWasteTypeIcon = (type) => {
    const icons = {
      plastic: "♻️",
      organic: "🌱",
      electronic: "⚡",
      glass: "🥤",
      paper: "📄",
      metal: "🔩",
      mixed: "🗑️",
    };
    return icons[type?.toLowerCase()] || "📦";
  };

  const filteredRequests =
    filterStatus === "all"
      ? admin?.pickupRequests
      : admin?.pickupRequests?.filter(
          (req) => req.status.toLowerCase() === filterStatus
        );

  const renderPickupRequests = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚛</div>
            <p style={{ fontSize: "1.2rem", color: "#64748b" }}>
              Loading pickup requests...
            </p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <p style={{ color: "#ef4444", fontSize: "1.2rem" }}>
              Error loading pickup requests
            </p>
          </div>
        </div>
      );
    }

    if (!filteredRequests?.length) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            background: "white",
            borderRadius: "16px",
            padding: "3rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚚</div>
          <h3
            style={{
              fontSize: "1.5rem",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            No Pickup Requests Found
          </h3>
          <p style={{ color: "#64748b" }}>
            {filterStatus === "all"
              ? "There are currently no pickup requests."
              : `No ${filterStatus} requests found.`}
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "24px",
        }}
      >
        {filteredRequests.map((req) => {
          const statusStyle = getStatusStyle(req.status);
          const wasteIcon = getWasteTypeIcon(req.wasteType);

          return (
            <div
              key={req._id}
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
            >
              {/* Header with Status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "20px",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      marginBottom: "6px",
                      fontWeight: 500,
                    }}
                  >
                    Request ID: {req._id.slice(-8).toUpperCase()}
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#1e293b",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      lineHeight: 1.4,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    📍 {req.pickupAddress}
                  </h3>
                </div>
                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    flexShrink: 0,
                    background: statusStyle.background,
                    color: statusStyle.color,
                  }}
                >
                  <span>{statusStyle.icon}</span>
                  {req.status}
                </span>
              </div>

              {/* Main Info Grid */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        fontWeight: 600,
                        marginBottom: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{wasteIcon}</span>
                      Waste Type
                    </div>
                    <div
                      style={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      {req.wasteType}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        fontWeight: 600,
                        marginBottom: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>📦</span>
                      Estimated Quantity
                    </div>
                    <div
                      style={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      {req.estimatedQuantity}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        fontWeight: 600,
                        marginBottom: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>📅</span>
                      Preferred Date
                    </div>
                    <div
                      style={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      {new Date(req.preferredDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {req.notes && (
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#64748b",
                          fontWeight: 600,
                          marginBottom: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>📝</span>
                        Notes
                      </div>
                      <div
                        style={{
                          color: "#475569",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          fontStyle: "italic",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        "{req.notes}"
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with User Info */}
              {req.owner && (
                <div
                  style={{
                    borderTop: "2px solid #e5e7eb",
                    paddingTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #2f6b2f, #1f5520)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        flexShrink: 0,
                      }}
                    >
                      {req.owner.fullName?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {req.owner.fullName}
                      </div>
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "0.85rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {req.owner.email}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.8rem",
                      textAlign: "right",
                    }}
                  >
                    Submitted:{" "}
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {req.status === "pending" && (
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    ✓ Accept
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "2px solid #ef4444",
                      background: "white",
                      color: "#ef4444",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ef4444";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#ef4444";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    ✗ Decline
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: '"Segoe UI", sans-serif',
        background: "#f3f4f6",
      }}
    >
      <SideBar />

      <main
        style={{
          flex: 1,
          padding: isMobile ? "70px 24px 24px" : "40px 50px",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
            }}
          >
            🚚 Pickup Requests
          </h1>
          <p
            style={{
              color: "#64748b",
              marginTop: "8px",
              fontSize: "1rem",
            }}
          >
            Manage and track all waste pickup requests
          </p>
        </header>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {["all"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    filterStatus === status
                      ? "linear-gradient(135deg, #2f6b2f, #1f5520)"
                      : "white",
                  color: filterStatus === status ? "white" : "#64748b",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                  boxShadow:
                    filterStatus === status
                      ? "0 4px 12px rgba(47,107,47,0.3)"
                      : "0 2px 4px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  if (filterStatus !== status) {
                    e.currentTarget.style.background = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterStatus !== status) {
                    e.currentTarget.style.background = "white";
                  }
                }}
              >
                {status === "all" ? "All Requests" : status.replace("-", " ")}
              </button>
            )
          )}
        </div>

        {renderPickupRequests()}
      </main>
    </div>
  );
}