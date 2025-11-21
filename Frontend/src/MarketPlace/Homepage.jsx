import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { setProducts, setLoading, setError } from "../store/productSlice";
import { getProducts } from "../api/productApi";

const navItems = [
  { key: "Home", path: "/marketPlace" },
  { key: "Sell", path: "/marketPlace/sellProduct" },
  { key: "Cart", path: "/marketPlace/shoppingCart" },
  { key: "Order", path: "/marketPlace/orderDetails" },
  { key: "History", path: "/marketPlace/history" },
  { key: "Dashboard", path: "/dashboard" },
];

const Homepage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const location = useLocation();

  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (data) {
      dispatch(setProducts(data.products || []));
    }
    if (isError) {
      dispatch(setError(queryError?.message || "Failed to fetch products"));
    }
  }, [data, isLoading, isError, queryError, dispatch]);

  // Styles remain unchanged
  const rootStyle = { fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%)", minHeight: "100vh" };
  const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#fff", borderBottom: "1px solid #e0e0e0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 };
  const headerLeftStyle = { display: "flex", alignItems: "center", gap: "1rem" };
  const logoStyle = { width: "48px", height: "48px", transition: "transform 0.3s ease", cursor: "pointer" };
  const headerRightStyle = { position: "relative" };
  const searchInputStyle = { padding: "0.75rem 1rem 0.75rem 2.5rem", width: "250px", borderRadius: "50px", border: "2px solid #e0e0e0", fontSize: "0.95rem", background: "#f5f7fa", outline: "none" };
  const searchIconStyle = { position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" };
  const navbarStyle = { display: "flex", justifyContent: "center", gap: "0.5rem", listStyle: "none", padding: "0.75rem 2rem", background: "#fff", borderBottom: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
  const navItemStyle = (active) => ({ padding: "0.7rem 1.5rem", borderRadius: "50px", cursor: "pointer", fontWeight: 500, color: active ? "#fff" : "#2c3e50", background: active ? "linear-gradient(135deg, #2e7d32, #43a047)" : "transparent", boxShadow: active ? "0 4px 15px rgba(46,125,50,0.3)" : "none", transition: "all 0.3s ease" });
  const mainStyle = { maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem" };
  const sectionHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" };
  const sectionTitleStyle = { fontSize: "2rem", fontWeight: "700", color: "#2c3e50", position: "relative" };
  const underlineStyle = { content: '""', position: "absolute", bottom: "-8px", left: 0, width: "60px", height: "4px", borderRadius: "2px", background: "linear-gradient(90deg, #2e7d32, #66bb6a)" };
  const filterBtnStyle = { padding: "0.6rem 1.2rem", border: "2px solid #e0e0e0", borderRadius: "50px", cursor: "pointer", fontWeight: 500, background: "#fff", transition: "all 0.3s ease" };
  const productGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "2rem" };
  const productCardStyle = { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", transition: "all 0.4s ease", cursor: "pointer", overflow: "hidden", position: "relative" };
  const imageWrapperStyle = { width: "100%", height: "220px", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem", background: "linear-gradient(135deg, #f5f7fa, #e8f5e9)" };
  const imgStyle = { width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px", transition: "transform 0.4s ease" };
  const priceRowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1rem 0", padding: "0.75rem", background: "#f5f7fa", borderRadius: "12px" };
  const detailsBtnStyle = { width: "100%", padding: "0.85rem 1.5rem", background: "linear-gradient(135deg, #2e7d32, #43a047)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 600, fontSize: "1rem", boxShadow: "0 4px 15px rgba(46,125,50,0.2)", transition: "all 0.3s ease", textDecoration: "none", display: "block" };
  const fabStyle = { position: "fixed", bottom: "2rem", right: "2rem", width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, #2e7d32, #43a047)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", cursor: "pointer", boxShadow: "0 4px 20px rgba(46,125,50,0.4)", transition: "all 0.3s ease" };

  if (loading) return <p style={{ textAlign: "center", padding: "2rem" }}>Loading products...</p>;
  if (error) return <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div style={rootStyle}>
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Logo" style={logoStyle} />
          <h1 style={{ ...headerLeftStyle, background: "linear-gradient(135deg, #2e7d32, #66bb6a)", WebkitBackgroundClip: "text", color: "transparent" }}>Recycle Reuse Reduce</h1>
        </div>
        <div style={headerRightStyle}>
          <input type="search" placeholder="Search products..." style={searchInputStyle} />
          <span style={searchIconStyle}>🔍</span>
        </div>
      </header>

      <nav style={navbarStyle}>
        <ul style={{ display: "flex", gap: "0.5rem", listStyle: "none" }}>
          {navItems.map((item) => (
            <li key={item.key} style={navItemStyle(location.pathname === item.path)}>
              <Link to={item.path} style={{ textDecoration: "none", color: "inherit" }}>{item.key}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <main style={mainStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Marketplace <span style={underlineStyle}></span></h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["All Items", "Plastics", "Metal", "Glass"].map((btn, idx) => <button key={idx} style={filterBtnStyle}>{btn}</button>)}
          </div>
        </div>

        <div style={productGridStyle}>
          {products.length > 0 ? products.map((product) => (
            <div key={product._id} style={productCardStyle}>
              <div style={imageWrapperStyle}>
                <img src={product.images?.[0] || "https://via.placeholder.com/280x220"} alt={product.name} style={imgStyle} />
              </div>
              <h3>{product.name}</h3>
              <p style={{ color: "#6c757d", fontSize: "0.9rem", marginBottom: "1rem" }}>{product.description}</p>
              <div style={priceRowStyle}><span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2e7d32" }}>Rs. {product.price}</span></div>
              <Link 
                to={`/marketPlace/productDetails/${product._id}`}
                style={detailsBtnStyle}
              >
                📄 More Details
              </Link>
            </div>
          )) : <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>No products available</p>}
        </div>
      </main>

      <div style={fabStyle}>+</div>
    </div>
  );
};

export default Homepage;