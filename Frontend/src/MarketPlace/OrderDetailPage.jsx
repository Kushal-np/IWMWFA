import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getOrderById, updateOrderStatus } from "../api/productApi"; // Update path

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Fetch single order details
  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  // Update order status mutation
  const updateMutation = useMutation({
    mutationFn: (status) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["order", id]);
      queryClient.invalidateQueries(["myOrders"]);
      alert("Order status updated successfully! ✅");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update order status");
    },
  });

  const order = orderData?.order;

  const statusColors = {
    pending: "#ff9800",
    confirmed: "#2e7d32",
    cancelled: "#e53935",
    completed: "#1b5e20",
  };

  const btnStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    border: "none",
    transition: "all 0.3s ease",
  };

  if (isLoading) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f5f7fa" }}>
        <header
          style={{
            background: "white",
            padding: "1.5rem 2rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => navigate("/marketPlace/orderDetails")}
            style={{
              background: "none",
              border: "none",
              color: "#2e7d32",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Back to Orders
          </button>
        </header>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontSize: "1.2rem", color: "#6c757d" }}>
          Loading order details...
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f5f7fa" }}>
        <header
          style={{
            background: "white",
            padding: "1.5rem 2rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => navigate("/marketPlace/orderDetails")}
            style={{
              background: "none",
              border: "none",
              color: "#2e7d32",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Back to Orders
          </button>
        </header>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "3rem" }}>❌</div>
          <h3 style={{ color: "#e53935", fontSize: "1.5rem" }}>Order Not Found</h3>
          <p style={{ color: "#6c757d" }}>{error?.response?.data?.message || "The order you're looking for doesn't exist or you don't have access to it."}</p>
          <button
            onClick={() => navigate("/marketPlace/orderDetails")}
            style={{
              ...btnStyle,
              background: "#2e7d32",
              color: "white",
            }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa, #e8f5e9)" }}>
      {/* Header */}
      <header
        style={{
          background: "white",
          padding: "1.5rem 2rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate("/marketPlace/orderDetails")}
          style={{
            background: "none",
            border: "none",
            color: "#2e7d32",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ← Back to Orders
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Logo"
            style={{ width: 40, height: 40, cursor: "pointer" }}
            onClick={() => navigate("/marketPlace")}
          />
          <h1
            style={{
              fontSize: "1.3rem",
              background: "linear-gradient(135deg,#2e7d32,#1b5e20)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            Recycle Reuse Reduce
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem 3rem" }}>
        {/* Order Header Card */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1 style={{ fontSize: "2rem", color: "#2c3e50", marginBottom: "0.5rem", fontWeight: 700 }}>
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p style={{ color: "#6c757d", fontSize: "1rem" }}>
                📅 Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div
              style={{
                background: statusColors[order.status],
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              padding: "1.5rem",
              background: "#f5f7fa",
              borderRadius: "12px",
            }}
          >
            <div>
              <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: 600 }}>
                📍 Delivery Address
              </h3>
              <p style={{ color: "#6c757d", lineHeight: 1.6 }}>{order.deliveryAddress}</p>
            </div>
            <div>
              <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: 600 }}>
                📞 Contact Number
              </h3>
              <p style={{ color: "#6c757d", lineHeight: 1.6 }}>{order.contactNumber}</p>
            </div>
            {order.notes && (
              <div style={{ gridColumn: "1 / -1" }}>
                <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: 600 }}>
                  📝 Order Notes
                </h3>
                <p style={{ color: "#6c757d", lineHeight: 1.6, fontStyle: "italic" }}>{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Card */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ color: "#2c3e50", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 700 }}>
            📦 Order Items
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  background: "#f5f7fa",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(46,125,50,0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => navigate(`/marketPlace/productDetails/${item.product?._id}`)}
              >
                <img
                  src={item.product?.images?.[0] || "https://via.placeholder.com/120"}
                  alt={item.product?.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem", fontSize: "1.2rem", fontWeight: 600 }}>
                    {item.product?.name || "Product Unavailable"}
                  </h4>
                  <p style={{ color: "#6c757d", fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                    <strong>Quantity:</strong> {item.quantity} piece{item.quantity > 1 ? "s" : ""}
                  </p>
                  <p style={{ color: "#6c757d", fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                    <strong>Unit Price:</strong> Rs. {item.price}
                  </p>
                  {item.product?.seller?.fullName && (
                    <p style={{ color: "#6c757d", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                      <strong>Seller:</strong> {item.product.seller.fullName}
                      {item.product.seller.ward_no && ` (Ward ${item.product.seller.ward_no})`}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.5rem 1rem",
                      background: "white",
                      borderRadius: "8px",
                      display: "inline-block",
                    }}
                  >
                    <p style={{ color: "#2e7d32", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>
                      Subtotal: Rs. {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "2px solid #e0e0e0",
            }}
          >
            <div>
              <p style={{ color: "#6c757d", fontSize: "1rem", marginBottom: "0.25rem" }}>Total Items</p>
              <p style={{ color: "#2c3e50", fontSize: "1.2rem", fontWeight: 600 }}>
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} piece(s)
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#6c757d", fontSize: "1rem", marginBottom: "0.25rem" }}>Total Amount</p>
              <p style={{ color: "#2e7d32", fontSize: "2.5rem", fontWeight: 700, margin: 0 }}>
                Rs. {totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Buyer Information (if you're the buyer) */}
        {order.buyer && (
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ color: "#2c3e50", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 700 }}>
              👤 Buyer Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <p style={{ color: "#6c757d", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Name</p>
                <p style={{ color: "#2c3e50", fontWeight: 600 }}>{order.buyer.fullName}</p>
              </div>
              <div>
                <p style={{ color: "#6c757d", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Email</p>
                <p style={{ color: "#2c3e50", fontWeight: 600 }}>{order.buyer.email}</p>
              </div>
              {order.buyer.phone && (
                <div>
                  <p style={{ color: "#6c757d", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Phone</p>
                  <p style={{ color: "#2c3e50", fontWeight: 600 }}>{order.buyer.phone}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {order.status !== "cancelled" && order.status !== "completed" && (
          <div
            style={{
              background: "white",
              padding: "1.5rem 2rem",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {order.status === "pending" && (
              <button
                onClick={() => {
                  if (window.confirm("Confirm this order?")) {
                    updateMutation.mutate("confirmed");
                  }
                }}
                disabled={updateMutation.isLoading}
                style={{
                  ...btnStyle,
                  background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
                  color: "white",
                  opacity: updateMutation.isLoading ? 0.6 : 1,
                }}
              >
                {updateMutation.isLoading ? "Processing..." : "✓ Confirm Order"}
              </button>
            )}
            {order.status === "confirmed" && (
              <button
                onClick={() => {
                  if (window.confirm("Mark this order as completed?")) {
                    updateMutation.mutate("completed");
                  }
                }}
                disabled={updateMutation.isLoading}
                style={{
                  ...btnStyle,
                  background: "linear-gradient(135deg, #1b5e20, #0d3d10)",
                  color: "white",
                  opacity: updateMutation.isLoading ? 0.6 : 1,
                }}
              >
                {updateMutation.isLoading ? "Processing..." : "✓ Mark as Completed"}
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this order?")) {
                  updateMutation.mutate("cancelled");
                }
              }}
              disabled={updateMutation.isLoading}
              style={{
                ...btnStyle,
                background: "white",
                color: "#e53935",
                border: "2px solid #e53935",
                opacity: updateMutation.isLoading ? 0.6 : 1,
              }}
            >
              {updateMutation.isLoading ? "Processing..." : "✗ Cancel Order"}
            </button>
          </div>
        )}

        {/* Completed/Cancelled Message */}
        {(order.status === "completed" || order.status === "cancelled") && (
          <div
            style={{
              background: order.status === "completed" ? "#e8f5e9" : "#ffebee",
              padding: "1.5rem",
              borderRadius: "16px",
              textAlign: "center",
              border: `2px solid ${order.status === "completed" ? "#2e7d32" : "#e53935"}`,
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
              {order.status === "completed" ? "✅" : "❌"}
            </div>
            <h3 style={{ color: order.status === "completed" ? "#1b5e20" : "#c62828", marginBottom: "0.5rem" }}>
              Order {order.status === "completed" ? "Completed" : "Cancelled"}
            </h3>
            <p style={{ color: "#6c757d" }}>
              {order.status === "completed"
                ? "This order has been successfully completed. Thank you for your purchase!"
                : "This order has been cancelled and no further action can be taken."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderDetailPage;