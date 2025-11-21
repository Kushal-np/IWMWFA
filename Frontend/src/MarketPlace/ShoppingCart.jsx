import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrder,
} from "../api/productApi"; // Update path if needed
import { setCart, clearCartState } from "../store/productSlice";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    deliveryAddress: "",
    contactNumber: "",
    notes: "",
  });

  // Fetch cart data
  const {
    data: cartData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    onSuccess: (data) => {
      if (data.success) {
        dispatch(setCart(data.cart));
      }
    },
  });

  // Update cart item quantity
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }) => updateCartItem(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      dispatch(setCart(data.cart));
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update cart");
    },
  });

  // Remove item from cart
  const removeMutation = useMutation({
    mutationFn: (productId) => removeFromCart(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      dispatch(setCart(data.cart));
      alert("Item removed from cart ✅");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to remove item");
    },
  });

  // Clear entire cart
  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      dispatch(clearCartState());
      alert("Cart cleared ✅");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to clear cart");
    },
  });

  // Create order (Checkout)
  const checkoutMutation = useMutation({
    mutationFn: ({ deliveryAddress, contactNumber, notes }) =>
      createOrder(deliveryAddress, contactNumber, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      queryClient.invalidateQueries(["myOrders"]);
      dispatch(clearCartState());
      setShowCheckoutModal(false);
      setCheckoutForm({ deliveryAddress: "", contactNumber: "", notes: "" });
      alert("🎉 Order placed successfully!");
      navigate("/marketPlace/orderDetails");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to place order");
    },
  });

  const cart = cartData?.cart;
  const cartItems = cart?.items || [];

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = subtotal * 0.13; // 13% VAT
  const shipping = subtotal > 0 ? 100 : 0; // Rs. 100 shipping
  const ecoDiscount = subtotal * 0.05; // 5% eco discount
  const total = subtotal + tax + shipping - ecoDiscount;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      if (window.confirm("Remove this item from cart?")) {
        removeMutation.mutate(productId);
      }
      return;
    }
    if (newQuantity > 10) {
      alert("Maximum quantity is 10");
      return;
    }
    updateMutation.mutate({ productId, quantity: newQuantity });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    if (!checkoutForm.deliveryAddress.trim()) {
      alert("Please enter delivery address");
      return;
    }
    if (!checkoutForm.contactNumber.trim()) {
      alert("Please enter contact number");
      return;
    }

    // Validate Nepali phone number (10 digits starting with 97 or 98)
    const phoneRegex = /^(97|98)\d{8}$/;
    if (!phoneRegex.test(checkoutForm.contactNumber)) {
      alert("Please enter a valid Nepali phone number (10 digits starting with 97 or 98)");
      return;
    }

    checkoutMutation.mutate({
      deliveryAddress: checkoutForm.deliveryAddress,
      contactNumber: checkoutForm.contactNumber,
      notes: checkoutForm.notes,
    });
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
      <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #f5f7fa, #e8f5e9)", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontSize: "1.2rem", color: "#6c757d" }}>
          Loading cart...
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
                color: tab.name === "Cart" ? "white" : "#2c3e50",
                background: tab.name === "Cart" ? "linear-gradient(135deg,#2e7d32,#1b5e20)" : "transparent",
                boxShadow: tab.name === "Cart" ? "0 4px 15px rgba(46,125,50,0.3)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ padding: "3rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#2c3e50" }}>
            Shopping Cart ({cartItems.length})
          </h2>
          {cartItems.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear entire cart?")) {
                  clearMutation.mutate();
                }
              }}
              style={{
                ...btnStyle,
                background: "white",
                color: "#e53935",
                border: "2px solid #e53935",
              }}
            >
              Clear Cart
            </button>
          )}
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
            <h3 style={{ margin: "1rem 0", color: "#e53935" }}>Error Loading Cart</h3>
            <p style={{ color: "#6c757d" }}>{error?.response?.data?.message || "Failed to fetch cart"}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 64,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 64 }}>🛒</div>
            <h3 style={{ margin: "1rem 0", fontSize: "1.5rem" }}>Your Cart is Empty</h3>
            <p style={{ color: "#6c757d", marginBottom: "2rem" }}>
              Add some eco-friendly products to get started!
            </p>
            <button
              onClick={() => navigate("/marketPlace")}
              style={{
                ...btnStyle,
                background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
                color: "white",
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32 }}>
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cartItems.map((item) => (
                <div
                  key={item.product?._id}
                  style={{
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: 16,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.product?.images?.[0] || "https://via.placeholder.com/120"}
                    alt={item.product?.name}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 12,
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/marketPlace/productDetails/${item.product?._id}`)}
                  />
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{ color: "#2c3e50", marginBottom: 8, cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={() => navigate(`/marketPlace/productDetails/${item.product?._id}`)}
                    >
                      {item.product?.name || "Product Unavailable"}
                    </h4>
                    <p style={{ color: "#6c757d", fontSize: 14, marginBottom: 4 }}>
                      {item.product?.category}
                    </p>
                    <p style={{ color: "#2e7d32", fontWeight: 700, fontSize: "1.3rem" }}>
                      Rs. {item.product?.price || 0}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                    {/* Quantity Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={updateMutation.isLoading}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "2px solid #e0e0e0",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: 40, textAlign: "center", fontWeight: 600, fontSize: "1.1rem" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        disabled={updateMutation.isLoading}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "2px solid #2e7d32",
                          background: "#2e7d32",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeMutation.mutate(item.product._id)}
                      disabled={removeMutation.isLoading}
                      style={{
                        ...btnStyle,
                        padding: "0.5rem 1rem",
                        background: "white",
                        color: "#e53935",
                        border: "2px solid #e53935",
                        fontSize: "0.9rem",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                height: "fit-content",
                position: "sticky",
                top: 100,
              }}
            >
              <h3 style={{ fontSize: "1.5rem", marginBottom: 24, color: "#2c3e50" }}>Order Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6c757d" }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6c757d" }}>Tax (13%)</span>
                  <span style={{ fontWeight: 600 }}>Rs. {tax.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6c757d" }}>Shipping</span>
                  <span style={{ fontWeight: 600 }}>Rs. {shipping}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#2e7d32" }}>
                  <span>Eco Discount (5%)</span>
                  <span style={{ fontWeight: 600 }}>- Rs. {ecoDiscount.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 16,
                    borderTop: "2px solid #e0e0e0",
                    fontSize: "1.3rem",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 700, color: "#2e7d32" }}>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  ...btnStyle,
                  width: "100%",
                  background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
                  color: "white",
                  fontSize: "1.1rem",
                  padding: "1rem",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={() => setShowCheckoutModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "2rem",
              maxWidth: 500,
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: 24, color: "#2c3e50", fontSize: "1.8rem" }}>Checkout</h2>
            <form onSubmit={handleSubmitOrder}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>
                  Delivery Address *
                </label>
                <textarea
                  value={checkoutForm.deliveryAddress}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value })
                  }
                  required
                  rows={3}
                  placeholder="Enter your full delivery address"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: 10,
                    fontSize: "1rem",
                    fontFamily: "'Inter', sans-serif",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>
                  Contact Number *
                </label>
                <input
                  type="text"
                  value={checkoutForm.contactNumber}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, contactNumber: e.target.value })
                  }
                  required
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: 10,
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={checkoutForm.notes}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                  rows={2}
                  placeholder="Any special instructions?"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: 10,
                    fontSize: "1rem",
                    fontFamily: "'Inter', sans-serif",
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  background: "#f5f7fa",
                  padding: "1rem",
                  borderRadius: 10,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#6c757d" }}>Total Amount</span>
                  <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "#2e7d32" }}>
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  style={{
                    ...btnStyle,
                    flex: 1,
                    background: "white",
                    color: "#6c757d",
                    border: "2px solid #e0e0e0",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checkoutMutation.isLoading}
                  style={{
                    ...btnStyle,
                    flex: 1,
                    background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
                    color: "white",
                    opacity: checkoutMutation.isLoading ? 0.6 : 1,
                  }}
                >
                  {checkoutMutation.isLoading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;