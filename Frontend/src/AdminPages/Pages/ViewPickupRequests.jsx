import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setAllPickupRequests } from "../../store/adminSlice"; // you might need a separate slice for pickups
import { getAllPickupRequest } from "../../api/adminApi";
import SideBar from "../components/SideBar";

export default function ViewPickupRequests() {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin); // make sure admin slice has pickupRequests
  const [activeMenu, setActiveMenu] = useState("View All Requests");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allPickups"],
    queryFn: getAllPickupRequest,
  });

  useEffect(() => {
    if (data?.pickupRequests) {
      console.log("ALL PICKUP REQUESTS:", data.pickupRequests);
      dispatch(setAllPickupRequests(data.pickupRequests)); // store in redux if needed
    }
  }, [data, dispatch]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white" };
      case "in-progress":
        return { background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white" };
      case "completed":
        return { background: "linear-gradient(135deg, #2f6b2f, #3a7d3a)", color: "white" };
      case "cancelled":
        return { background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white" };
      default:
        return { background: "#999", color: "white" };
    }
  };

  const renderPickupRequests = () => {
    if (isLoading) return <p>Loading pickup requests...</p>;
    if (isError) return <p style={{ color: "red" }}>Error fetching pickup requests</p>;
    if (!admin?.pickupRequests?.length) return <p>No pickup requests found.</p>;

    return admin.pickupRequests.map((req) => (
      <div
        key={req._id}
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          marginBottom: 15,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: "#1f5520" }}>{req.pickupAddress}</h3>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              ...getStatusStyle(req.status),
            }}
          >
            {req.status}
          </span>
        </div>

        <p><strong>Waste Type:</strong> {req.wasteType}</p>
        <p><strong>Estimated Quantity:</strong> {req.estimatedQuantity}</p>
        <p><strong>Preferred Date:</strong> {new Date(req.preferredDate).toLocaleString()}</p>
        {req.notes && <p><strong>Notes:</strong> {req.notes}</p>}

        <p style={{ marginTop: 10, opacity: 0.7 }}>
          <strong>Requested By:</strong> {req.owner?.fullName} ({req.owner?.email})
        </p>

        <p style={{ opacity: 0.6 }}>
          <strong>Date Submitted:</strong> {new Date(req.createdAt).toLocaleString()}
        </p>
      </div>
    ));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: '"Segoe UI", sans-serif' }}>
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main style={{ flex: 1, padding: "40px 50px", overflowY: "auto" }}>
        {activeMenu === "View All Requests" && renderPickupRequests()}
      </main>
    </div>
  );
}
