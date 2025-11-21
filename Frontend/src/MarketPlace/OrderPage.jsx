import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getMyOrders, updateOrderStatus } from "../api/productApi"; // Update path
import { setMyOrders } from "../store/productSlice";

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch orders using TanStack Query
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
    onSuccess: (data) => {
      if (data.success) {
        dispatch(setMyOrders(data.orders));
      }
    },
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["myOrders"]);
      alert("Order status updated successfully! ✅");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update order status");
    },
  });

  const orders = ordersData?.orders || [];

  const filterOrders = (status) => {
    setActiveFilter(status);
  };

  const cancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      updateOrderMutation.mutate({ orderId, status: "cancelled" });
    }
  };

  const statusStyles = {
    pending: { backgroundColor: "#ff9800", color: "white" },
    confirmed: { backgroundColor: "#2e7d32", color: "white" },
    cancelled: { backgroundColor: "#e53935", color: "white" },
    completed: { backgroundColor: "#1b5e20", color: "white" },
  };

  const btnStyles = {
    primary: {
      backgroundColor: "#2e7d32",
      color: "white",
      borderRadius: 10,
      padding: "0.5rem 1rem",
      cursor: "pointer",
      fontWeight: 500,
      border: "none",
      transition: "0.3s",
    },
    outline: {
      backgroundColor: "white",
      border: "2px solid #e0e0e0",
      color: "#2c3e50",
      borderRadius: 10,
      padding: "0.5rem 1rem",
      cursor: "pointer",
      fontWeight: 500,
      transition: "0.3s",
    },
  };

  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  // Calculate total for an order
  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #f5f7fa, #e8f5e9)", minHeight: "100vh" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            background: "white",
            borderBottom: "1px solid #e0e0e0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              alt="Logo"
              style={{ width: 48, height: 48, cursor: "pointer" }}
              onClick={() => navigate("/marketPlace")}
            />
            <h1
              style={{
                fontSize: "1.5rem",
                background: "linear-gradient(135deg,#2e7d32,#1b5e20)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Recycle Reuse Reduce
            </h1>
          </div>
        </header>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontSize: "1.2rem", color: "#6c757d" }}>
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #f5f7fa, #e8f5e9)", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "white",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Logo"
            style={{ width: 48, height: 48, cursor: "pointer" }}
            onClick={() => navigate("/marketPlace")}
          />
          <h1
            style={{
              fontSize: "1.5rem",
              background: "linear-gradient(135deg,#2e7d32,#1b5e20)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Recycle Reuse Reduce
          </h1>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type="search"
            placeholder="Search products..."
            style={{
              padding: "0.75rem 1rem 0.75rem 3rem",
              width: 320,
              borderRadius: 50,
              border: "2px solid #e0e0e0",
              fontSize: "0.95rem",
              background: "#f5f7fa",
            }}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
        </div>
      </header>

      {/* Navbar */}
      <nav style={{ background: "white", borderBottom: "1px solid #e0e0e0", padding: "0.75rem 2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <ul style={{ display: "flex", gap: 8, justifyContent: "center", listStyle: "none", margin: 0, padding: 0 }}>
          {[
            { name: "Home", path: "/marketPlace" },
            { name: "Sell", path: "/marketPlace/sellProduct" },
            { name: "Cart", path: "/marketPlace/shoppingCart" },
            { name: "Order", path: "/marketPlace/orderDetails" },
            { name: "History", path: "/marketPlace/history" },
            { name: "Dashboard", path: "/dashboard" },
          ].map((tab) => (
            <li
              key={tab.name}
              onClick={() => navigate(tab.path)}
              style={{
                padding: "0.7rem 1.5rem",
                borderRadius: 50,
                cursor: "pointer",
                fontWeight: 500,
                color: tab.name === "Order" ? "white" : "#2c3e50",
                background: tab.name === "Order" ? "linear-gradient(135deg,#2e7d32,#1b5e20)" : "transparent",
                boxShadow: tab.name === "Order" ? "0 4px 15px rgba(46,125,50,0.3)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main */}
      <main style={{ padding: "3rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#2c3e50" }}>My Orders</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "pending", "confirmed", "cancelled", "completed"].map((filter) => (
              <button
                key={filter}
                onClick={() => filterOrders(filter)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 50,
                  cursor: "pointer",
                  fontWeight: 500,
                  background: activeFilter === filter ? "#2e7d32" : "white",
                  color: activeFilter === filter ? "white" : "#2c3e50",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isError && (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 48 }}>⚠️</div>
            <h3 style={{ margin: "1rem 0", color: "#e53935" }}>Error Loading Orders</h3>
            <p style={{ color: "#6c757d" }}>{error?.response?.data?.message || "Failed to fetch orders"}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {filteredOrders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 48,
                background: "white",
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: 48 }}>🌱</div>
              <h3 style={{ margin: "1rem 0" }}>No Orders Yet</h3>
              <p style={{ color: "#6c757d" }}>
                {activeFilter === "all"
                  ? "Looks like you haven't made any purchases yet."
                  : `No ${activeFilter} orders found.`}
              </p>
              <button
                style={{ ...btnStyles.primary, marginTop: 16 }}
                onClick={() => navigate("/marketPlace")}
              >
                Shop Now
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: "white",
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.5rem",
                    background: "#f5f7fa",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span style={{ color: "#6c757d", fontSize: 14 }}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: 16,
                        alignItems: "center",
                        paddingBottom: 16,
                        borderBottom: idx < order.items.length - 1 ? "1px solid #e0e0e0" : "none",
                      }}
                    >
                      <img
                        src={item.product?.images?.[0] || "https://via.placeholder.com/80"}
                        alt={item.product?.name || "Product"}
                        style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", cursor: "pointer" }}
                        onClick={() => navigate(`/marketPlace/productDetails/${item.product?._id}`)}
                      />
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{ color: "#2c3e50", marginBottom: 4, cursor: "pointer" }}
                          onClick={() => navigate(`/marketPlace/productDetails/${item.product?._id}`)}
                        >
                          {item.product?.name || "Product Unavailable"}
                        </h4>
                        <p style={{ color: "#6c757d", fontSize: 14 }}>Qty: {item.quantity}</p>
                        <div style={{ color: "#2e7d32", fontWeight: 700, marginTop: 4 }}>
                          {item.price > 0 ? `Rs. ${item.price * item.quantity}` : "FREE"}
                        </div>
                        {item.product?.seller?.fullName && (
                          <p style={{ color: "#6c757d", fontSize: 13, marginTop: 4 }}>
                            Seller: {item.product.seller.fullName}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          display: "inline-block",
                          ...statusStyles[order.status],
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <div>
                      <p style={{ color: "#6c757d", fontSize: 14, marginBottom: 4 }}>
                        Delivery Address: {order.deliveryAddress}
                      </p>
                      <p style={{ color: "#6c757d", fontSize: 14 }}>Contact: {order.contactNumber}</p>
                      <p style={{ color: "#2e7d32", fontWeight: 700, fontSize: 18, marginTop: 8 }}>
                        Total: Rs. {calculateOrderTotal(order)}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      {order.status !== "cancelled" && order.status !== "completed" && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          style={{ ...btnStyles.outline }}
                          disabled={updateOrderMutation.isLoading}
                        >
                          {updateOrderMutation.isLoading ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}
                      <button
                        style={btnStyles.primary}
                        onClick={() => navigate(`/marketPlace/orderDetails/${order._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderPage;