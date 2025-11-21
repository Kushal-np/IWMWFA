import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getProductById, addToCart } from "../api/productApi"; // Update path to your api file
import { setCart } from "../store/productSlice";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");

  // Fetch product details using TanStack Query
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    onSuccess: (data) => {
      if (data?.product?.images?.length > 0) {
        setMainImage(data.product.images[0]);
      }
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, qty }) => addToCart(productId, qty),
    onSuccess: (data) => {
      if (data.success) {
        dispatch(setCart(data.cart));
        queryClient.invalidateQueries(["cart"]);
        alert("Product added to cart successfully!");
      }
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to add to cart");
    },
  });

  const product = productData?.product;

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => Math.min(prev + 1, product?.quantity || 100));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate({ productId: product._id, qty: quantity });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCartMutation.mutate(
      { productId: product._id, qty: quantity },
      {
        onSuccess: () => {
          navigate("/marketPlace/shoppingCart");
        },
      }
    );
  };

  const colors = {
    green: "#2e7d32",
    lightGreen: "#66bb6a",
    accent: "#43a047",
    border: "#e0e0e0",
    white: "#ffffff",
    bg: "#f5f7fa",
    textDark: "#2c3e50",
    textLight: "#6c757d",
    red: "#e53935",
    yellow: "#ffc107",
    radius: "16px",
    shadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

  const styles = {
    body: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: `linear-gradient(135deg, ${colors.bg} 0%, #e8f5e9 100%)`,
      minHeight: "100vh",
    },
    header: {
      width: "100%",
      background: colors.white,
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: colors.shadow,
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logo: {
      width: "48px",
      height: "48px",
      cursor: "pointer",
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: 700,
      background: `linear-gradient(135deg, ${colors.green}, ${colors.lightGreen})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginLeft: "1rem",
    },
    main: {
      maxWidth: "1200px",
      margin: "2rem auto",
      padding: "0 2rem 3rem",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      fontSize: "1.2rem",
      color: colors.textLight,
    },
    errorContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      gap: "1rem",
    },
    errorText: {
      fontSize: "1.2rem",
      color: colors.red,
    },
    backButton: {
      padding: "0.75rem 1.5rem",
      background: colors.green,
      color: colors.white,
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 600,
    },
    productContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "3rem",
    },
    productImages: {
      position: "sticky",
      top: "120px",
      height: "fit-content",
    },
    mainImage: {
      width: "100%",
      aspectRatio: "1",
      borderRadius: colors.radius,
      overflow: "hidden",
      background: colors.white,
      boxShadow: colors.shadow,
      marginBottom: "1rem",
    },
    thumbnailGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "0.75rem",
    },
    thumbnail: (active) => ({
      aspectRatio: "1",
      borderRadius: "12px",
      overflow: "hidden",
      border: `2px solid ${active ? colors.green : colors.border}`,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: active ? "0 0 0 2px rgba(46,125,50,0.2)" : "none",
    }),
    productDetails: {
      background: colors.white,
      padding: "2rem",
      borderRadius: colors.radius,
      boxShadow: colors.shadow,
    },
    productBadge: {
      display: "inline-block",
      background: `linear-gradient(135deg, ${colors.green}, ${colors.accent})`,
      color: colors.white,
      padding: "0.4rem 1rem",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: 600,
      marginBottom: "1rem",
    },
    productTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      color: colors.textDark,
      marginBottom: "0.5rem",
    },
    productRating: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1.5rem",
      color: colors.yellow,
    },
    productPrice: {
      display: "flex",
      alignItems: "baseline",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    currentPrice: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: colors.green,
    },
    divider: {
      height: "1px",
      background: colors.border,
      margin: "1.5rem 0",
    },
    infoSection: { marginBottom: "1.5rem" },
    infoLabel: {
      fontWeight: 600,
      color: colors.textDark,
      marginBottom: "0.5rem",
      fontSize: "0.95rem",
    },
    infoValue: { color: colors.textLight, lineHeight: 1.6 },
    quantitySelector: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    quantityControls: {
      display: "flex",
      alignItems: "center",
      border: `2px solid ${colors.border}`,
      borderRadius: "12px",
      overflow: "hidden",
    },
    quantityBtn: {
      width: "40px",
      height: "40px",
      border: "none",
      background: colors.bg,
      cursor: "pointer",
      fontSize: "1.2rem",
      transition: "all 0.3s ease",
      color: colors.textDark,
    },
    quantityInput: {
      width: "60px",
      height: "40px",
      border: "none",
      textAlign: "center",
      fontWeight: 600,
      fontSize: "1rem",
    },
    stockInfo: { color: colors.green, fontSize: "0.9rem", fontWeight: 500 },
    actionButtons: { display: "flex", gap: "1rem", marginBottom: "1.5rem" },
    btn: (primary, disabled) => ({
      flex: 1,
      padding: "1rem",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      background: primary
        ? `linear-gradient(135deg, ${colors.green}, ${colors.accent})`
        : colors.white,
      color: primary ? colors.white : colors.green,
      border: primary ? "none" : `2px solid ${colors.green}`,
      transition: "all 0.3s ease",
      opacity: disabled ? 0.6 : 1,
    }),
    tabs: {
      background: colors.white,
      borderRadius: colors.radius,
      boxShadow: colors.shadow,
      overflow: "hidden",
      marginTop: "2rem",
    },
    tabHeaders: { display: "flex", borderBottom: `1px solid ${colors.border}` },
    tabHeader: (active) => ({
      flex: 1,
      padding: "1.2rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      color: active ? colors.green : colors.textLight,
      borderBottom: active ? `3px solid ${colors.green}` : "none",
      transition: "all 0.3s ease",
    }),
    tabContent: { padding: "2rem" },
    sellerCard: {
      background: colors.bg,
      padding: "1.5rem",
      borderRadius: "12px",
      marginTop: "1.5rem",
    },
    sellerHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
    },
    sellerAvatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${colors.green}, ${colors.accent})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.white,
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    sellerName: {
      fontWeight: 600,
      color: colors.textDark,
      fontSize: "1.1rem",
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.body}>
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={styles.logo}
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              alt="Logo"
              onClick={() => navigate("/marketPlace")}
            />
            <h1 style={styles.headerTitle}>Recycle Reuse Reduce</h1>
          </div>
        </header>
        <main style={styles.main}>
          <div style={styles.loadingContainer}>Loading product details...</div>
        </main>
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div style={styles.body}>
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={styles.logo}
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              alt="Logo"
              onClick={() => navigate("/marketPlace")}
            />
            <h1 style={styles.headerTitle}>Recycle Reuse Reduce</h1>
          </div>
        </header>
        <main style={styles.main}>
          <div style={styles.errorContainer}>
            <div style={styles.errorText}>
              {error?.response?.data?.message || "Product not found"}
            </div>
            <button
              style={styles.backButton}
              onClick={() => navigate("/marketPlace")}
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isOutOfStock = product.status !== "available" || product.quantity === 0;

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={styles.logo}
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Logo"
            onClick={() => navigate("/marketPlace")}
          />
          <h1 style={styles.headerTitle}>Recycle Reuse Reduce</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.productContainer}>
          {/* Product Images */}
          <div style={styles.productImages}>
            <div style={styles.mainImage}>
              <img
                src={mainImage || product.images[0] || "https://via.placeholder.com/600"}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div style={styles.thumbnailGrid}>
                {product.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    style={styles.thumbnail(mainImage === img)}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div style={styles.productDetails}>
            <span style={styles.productBadge}>
              ♻️ {product.listingType === "donation" ? "Free" : "For Sale"}
            </span>
            <h1 style={styles.productTitle}>{product.name}</h1>

            <div style={styles.productRating}>
              ★★★★★{" "}
              <span style={{ marginLeft: "0.5rem", fontSize: "0.9rem", color: colors.textLight }}>
                {product.views || 0} views
              </span>
            </div>

            {product.listingType === "sale" && (
              <div style={styles.productPrice}>
                <span style={styles.currentPrice}>Rs. {product.price}</span>
              </div>
            )}

            {product.listingType === "donation" && (
              <div style={styles.productPrice}>
                <span style={{ ...styles.currentPrice, fontSize: "1.8rem" }}>
                  FREE
                </span>
              </div>
            )}

            <div style={styles.divider}></div>

            <div style={styles.infoSection}>
              <div style={styles.infoLabel}>Description</div>
              <div style={styles.infoValue}>{product.description}</div>
            </div>

            <div style={styles.infoSection}>
              <div style={styles.infoLabel}>Category</div>
              <div style={styles.infoValue}>{product.category}</div>
            </div>

            <div style={styles.infoSection}>
              <div style={styles.infoLabel}>Condition</div>
              <div style={styles.infoValue}>
                {product.condition?.charAt(0).toUpperCase() + product.condition?.slice(1)}
              </div>
            </div>

            <div style={styles.infoSection}>
              <div style={styles.infoLabel}>Location</div>
              <div style={styles.infoValue}>
                {product.location} (Ward {product.ward_no})
              </div>
            </div>

            <div style={styles.quantitySelector}>
              <div style={styles.infoLabel}>Quantity:</div>
              <div style={styles.quantityControls}>
                <button
                  style={styles.quantityBtn}
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <input
                  style={styles.quantityInput}
                  type="number"
                  value={quantity}
                  readOnly
                />
                <button
                  style={styles.quantityBtn}
                  onClick={() => handleQuantityChange("increase")}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
              <span style={styles.stockInfo}>
                {isOutOfStock ? (
                  <span style={{ color: colors.red }}>✗ Out of stock</span>
                ) : (
                  `✓ ${product.quantity} pieces in stock`
                )}
              </span>
            </div>

            <div style={styles.actionButtons}>
              <button
                style={styles.btn(false, isOutOfStock || addToCartMutation.isLoading)}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addToCartMutation.isLoading}
              >
                🛒 {addToCartMutation.isLoading ? "Adding..." : "Add to Cart"}
              </button>
              <button
                style={styles.btn(true, isOutOfStock || addToCartMutation.isLoading)}
                onClick={handleBuyNow}
                disabled={isOutOfStock || addToCartMutation.isLoading}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div style={styles.sellerCard}>
                <div style={styles.sellerHeader}>
                  <div style={styles.sellerAvatar}>
                    {product.seller.fullName?.charAt(0).toUpperCase() || "S"}
                  </div>
                  <div>
                    <div style={styles.sellerName}>{product.seller.fullName}</div>
                    <div style={{ color: colors.textLight, fontSize: "0.85rem" }}>
                      Ward {product.seller.ward_no}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <div style={styles.tabHeaders}>
            <button
              style={styles.tabHeader(activeTab === "specifications")}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              style={styles.tabHeader(activeTab === "seller")}
              onClick={() => setActiveTab("seller")}
            >
              Seller Info
            </button>
          </div>
          <div style={styles.tabContent}>
            {activeTab === "specifications" && (
              <div>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Condition:</strong> {product.condition}</p>
                <p><strong>Listing Type:</strong> {product.listingType}</p>
                <p><strong>Quantity Available:</strong> {product.quantity}</p>
                <p><strong>Location:</strong> {product.location}</p>
              </div>
            )}
            {activeTab === "seller" && product.seller && (
              <div>
                <p><strong>Name:</strong> {product.seller.fullName}</p>
                <p><strong>Email:</strong> {product.seller.email}</p>
                <p><strong>Ward:</strong> {product.seller.ward_no}</p>
                {product.seller.phone && (
                  <p><strong>Phone:</strong> {product.seller.phone}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;