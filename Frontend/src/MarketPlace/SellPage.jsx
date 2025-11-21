import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createProduct } from "../api/productApi";
import { addListing } from "../store/productSlice";

export const SellPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [listingType, setListingType] = useState("sale");
  const [selectedCategory, setSelectedCategory] = useState("Plastics");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    condition: "",
    quantity: "",
    location: "",
  });

  const MAX_IMAGES = 5;

  const categories = [
    "Plastics",
    "Metal",
    "Glass",
    "Cardboard",
    "Paper",
    "Textile",
    "E-Waste",
    "Wood",
  ];

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      if (data.success) {
        dispatch(addListing(data.product));
        queryClient.invalidateQueries(["products"]);
        queryClient.invalidateQueries(["myListings"]);
        setShowModal(true);
      }
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to create product listing");
    },
  });

  const handleListingType = (type) => {
    setListingType(type);
    if (type === "donate") {
      setFormData({ ...formData, price: "0" });
    }
  };

  const handleCategorySelect = (cat) => setSelectedCategory(cat);

  const handleFiles = (files) => {
    const remaining = MAX_IMAGES - uploadedFiles.length;
    const filesToAdd = Array.from(files).slice(0, remaining);
    
    const validFiles = filesToAdd.filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length < filesToAdd.length) {
      alert("Some files are invalid or too large (max 5MB per image).");
    }
    
    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one image");
      return false;
    }
    if (!formData.name.trim()) {
      alert("Please enter product name");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Please enter product description");
      return false;
    }
    if (listingType === "sale" && (!formData.price || parseFloat(formData.price) <= 0)) {
      alert("Please enter a valid price");
      return false;
    }
    if (!formData.quantity.trim()) {
      alert("Please enter quantity/weight");
      return false;
    }
    if (!formData.location.trim()) {
      alert("Please enter pickup location");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submitData = new FormData();
    
    uploadedFiles.forEach((file) => {
      submitData.append("images", file);
    });

    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("category", selectedCategory);
    submitData.append("listingType", listingType);
    submitData.append("price", listingType === "donate" ? 0 : parseFloat(formData.price));
    submitData.append("condition", formData.condition);
    submitData.append("quantity", formData.quantity);
    submitData.append("location", formData.location);

    createProductMutation.mutate(submitData);
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadedFiles([]);
    setFormData({
      name: "",
      description: "",
      price: "",
      condition: "",
      quantity: "",
      location: "",
    });
    setListingType("sale");
    setSelectedCategory("Plastics");
    navigate("/marketPlace");
  };

  const styles = {
    root: {
      fontFamily: "Inter, system-ui, sans-serif",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%)",
      minHeight: "100vh",
      margin: 0,
      padding: 0,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "#fff",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid #e0e0e0",
    },
    logo: { 
      width: 48, 
      height: 48, 
      cursor: "pointer", 
      transition: "transform 0.3s" 
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: 700,
      background: "linear-gradient(135deg,#2e7d32,#66bb6a)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    searchInput: {
      padding: "0.75rem 1rem 0.75rem 3rem",
      borderRadius: 50,
      border: "2px solid #e0e0e0",
      fontSize: "0.95rem",
      background: "#f5f7fa",
      outline: "none",
      width: 300,
    },
    navbar: {
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem 2rem",
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      borderBottom: "1px solid #e0e0e0",
    },
    navItem: (active) => ({
      padding: "0.7rem 1.5rem",
      borderRadius: 50,
      fontWeight: 500,
      cursor: "pointer",
      color: active ? "#fff" : "#2c3e50",
      background: active ? "linear-gradient(135deg,#2e7d32,#43a047)" : "transparent",
      boxShadow: active ? "0 4px 15px rgba(46,125,50,0.3)" : "none",
      transition: "all 0.3s ease",
    }),
    main: { 
      maxWidth: 900, 
      margin: "2rem auto", 
      padding: "0 1rem 3rem" 
    },
    sectionTitle: { 
      fontSize: "2rem", 
      fontWeight: 700, 
      marginBottom: "1.5rem",
      color: "#2c3e50",
    },
    formCard: {
      background: "#fff",
      padding: "2rem",
      borderRadius: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    },
    formGroup: { 
      display: "flex", 
      flexDirection: "column", 
      marginBottom: "1rem" 
    },
    label: {
      fontWeight: 600,
      marginBottom: "0.5rem",
      color: "#2c3e50",
      fontSize: "0.95rem",
    },
    input: { 
      padding: "0.85rem 1rem", 
      border: "2px solid #e0e0e0", 
      borderRadius: 12, 
      fontSize: "0.95rem", 
      outline: "none",
      transition: "border-color 0.3s",
    },
    btn: {
      width: "100%",
      padding: "1rem 2rem",
      background: "linear-gradient(135deg,#2e7d32,#43a047)",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      fontWeight: 600,
      fontSize: "1.1rem",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(46,125,50,0.3)",
      transition: "all 0.3s ease",
    },
    imagePreview: { 
      width: 120, 
      height: 120, 
      borderRadius: 12, 
      overflow: "hidden", 
      position: "relative", 
      marginRight: "1rem",
      marginBottom: "1rem",
    },
  };

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img 
            style={styles.logo} 
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png" 
            alt="logo"
            onClick={() => navigate("/marketPlace")}
          />
          <h1 style={styles.headerTitle}>Recycle Reuse Reduce</h1>
        </div>
        <input 
          type="search" 
          placeholder="Search products..." 
          style={styles.searchInput} 
        />
      </header>

      <nav style={styles.navbar}>
        {[
          { name: "Home", path: "/marketPlace" },
          { name: "Sell", path: "/marketPlace/sellProduct" },
          { name: "Cart", path: "/marketPlace/shoppingCart" },
          { name: "Order", path: "/marketPlace/orderDetails" },
          { name: "History", path: "/marketPlace/history" },
          { name: "Dashboard", path: "/dashboard" },
        ].map((item, idx) => (
          <div 
            key={idx} 
            style={styles.navItem(item.name === "Sell")}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </div>
        ))}
      </nav>

      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>List Your Item</h2>

        <div style={styles.formCard}>
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>📷 Product Images (Max 5)</h3>
            <div
              style={{
                border: "2px dashed #e0e0e0",
                borderRadius: 12,
                padding: "2rem",
                textAlign: "center",
                cursor: uploadedFiles.length >= MAX_IMAGES ? "not-allowed" : "pointer",
                marginBottom: "1rem",
                background: uploadedFiles.length >= MAX_IMAGES ? "#f5f5f5" : "transparent",
                transition: "all 0.3s",
              }}
              onClick={() => uploadedFiles.length < MAX_IMAGES && document.getElementById("fileInput").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={uploadedFiles.length < MAX_IMAGES ? handleDrop : null}
            >
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
                disabled={uploadedFiles.length >= MAX_IMAGES}
              />
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                {uploadedFiles.length >= MAX_IMAGES ? "✅" : "📤"}
              </div>
              <p>
                {uploadedFiles.length >= MAX_IMAGES ? (
                  <span style={{ color: "#2e7d32", fontWeight: 600 }}>
                    Maximum images uploaded ({MAX_IMAGES}/{MAX_IMAGES})
                  </span>
                ) : (
                  <>
                    <span style={{ color: "#2e7d32", fontWeight: 600 }}>Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                PNG, JPG up to 5MB ({uploadedFiles.length}/{MAX_IMAGES} uploaded)
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {uploadedFiles.map((file, i) => (
                <div key={i} style={styles.imagePreview}>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="preview" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  <button
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>📦 Basic Information</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Recycled Plastic Bottles" 
                style={styles.input} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea 
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your item in detail..." 
                style={{ ...styles.input, minHeight: 120, resize: "vertical" }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>🏷️ Category *</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {categories.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: 50,
                    cursor: "pointer",
                    border: "2px solid #e0e0e0",
                    background: selectedCategory === cat ? "linear-gradient(135deg,#2e7d32,#43a047)" : "#fff",
                    color: selectedCategory === cat ? "#fff" : "#2c3e50",
                    fontWeight: 500,
                    transition: "all 0.3s",
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>💰 Listing Type *</h3>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["sale", "donate"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleListingType(type)}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: 12,
                    cursor: "pointer",
                    border: listingType === type ? "2px solid #2e7d32" : "2px solid #e0e0e0",
                    background: listingType === type ? "linear-gradient(135deg,#2e7d32,#43a047)" : "#fff",
                    color: listingType === type ? "#fff" : "#2c3e50",
                    fontWeight: 600,
                    fontSize: "1rem",
                    transition: "all 0.3s",
                  }}
                >
                  {type === "sale" ? "🏷️ Sell" : "🎁 Donate"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>
              {listingType === "sale" ? "💰 Pricing & Details" : "📦 Details"}
            </h3>
            {listingType === "sale" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Price (Rs.) *</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Enter price in Rupees" 
                  style={styles.input}
                  min="0"
                />
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={styles.label}>Condition</label>
              <input 
                type="text" 
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                placeholder="e.g., New, Good, Fair" 
                style={styles.input} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity / Weight *</label>
              <input 
                type="text" 
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="e.g., 50 pieces or 10 kg" 
                style={styles.input} 
              />
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>📍 Pickup Location</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location *</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter your city or area" 
                style={styles.input} 
              />
            </div>
          </div>

          <button 
            style={{
              ...styles.btn,
              opacity: createProductMutation.isLoading ? 0.6 : 1,
              cursor: createProductMutation.isLoading ? "not-allowed" : "pointer",
            }}
            onClick={handleSubmit}
            disabled={createProductMutation.isLoading}
          >
            {createProductMutation.isLoading ? "⏳ Listing..." : "🌿 List My Item"}
          </button>
        </div>

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 200,
            }}
            onClick={closeModal}
          >
            <div 
              style={{ 
                background: "#fff", 
                padding: "2.5rem", 
                borderRadius: 16, 
                textAlign: "center", 
                maxWidth: 450,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "#2e7d32" }}>
                Item Listed Successfully!
              </h3>
              <p style={{ color: "#6c757d", marginBottom: "2rem", lineHeight: 1.6 }}>
                Your eco-friendly product is now live on the marketplace. 
                Buyers can now see and purchase your item.
              </p>
              <button style={styles.btn} onClick={closeModal}>
                🏠 Back to Marketplace
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};