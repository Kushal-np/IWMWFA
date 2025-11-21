import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setAllComplaints } from "../../store/adminSlice";
import { getAllPickupRequest } from "../../api/adminApi";

export default function ViewPickupRequests() {
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState("View Complaints");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const admin = useSelector((state) => state.admin);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allPickups"],
    queryFn: getAllPickupRequest,
  });

  useEffect(() => {
    if (data?.complaints) {
      console.log("ALL COMPLAINTS:", data.complaints);
      dispatch(setAllComplaints(data.complaints));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      console.log("QUERY ERROR:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { name: "View All Requests", key: "requests" },
    { name: "View Complaints", key: "complaints" },
    { name: "Update Schedules", key: "schedules" },
    { name: "Update Routes", key: "routes" },
    { name: "Add Trucks", key: "trucks" },
    { name: "Logout", key: "logout" }
  ];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': 
        return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' };
      case 'in-progress': 
        return { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white' };
      case 'resolved': 
        return { background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)', color: 'white' };
      case 'rejected': 
        return { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' };
      default: 
        return { background: '#999', color: 'white' };
    }
  };

  const sidebarStyle = {
    position: isMobile ? 'fixed' : 'static',
    top: 0,
    left: 0,
    bottom: 0,
    width: '250px',
    background: 'linear-gradient(180deg, #2f6b2f 0%, #25592b 100%)',
    color: 'white',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
    zIndex: 40,
    transform: isMobile ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
    transition: 'transform 0.3s ease-in-out'
  };

  const renderComplaints = () => (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>
        All Complaints
      </h1>
      <p style={{ opacity: 0.6, marginBottom: '25px', color: '#2f6b2f' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
            <h3 style={{ margin: 0, color: '#1f5520' }}>{c.title}</h3>
            <span style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              ...getStatusStyle(c.status)
            }}>
              {c.status}
            </span>
          </div>

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

          <p><strong>Description:</strong> {c.description}</p>
          <p><strong>Location:</strong> {c.location}</p>
          <p><strong>Category:</strong> {c.category}</p>

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

  const renderRequests = () => (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>
        All Pickup Requests
      </h1>
      <p style={{ opacity: 0.6, marginBottom: '25px', color: '#2f6b2f' }}>
        Manage all pickup requests from users
      </p>
      <p>Pickup requests content will go here...</p>
    </div>
  );

  const renderSchedules = () => (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>
        Update Schedules
      </h1>
      <p style={{ opacity: 0.6, marginBottom: '25px', color: '#2f6b2f' }}>
        Manage and update pickup schedules
      </p>
      <p>Schedule management content will go here...</p>
    </div>
  );

  const renderRoutes = () => (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>
        Update Routes
      </h1>
      <p style={{ opacity: 0.6, marginBottom: '25px', color: '#2f6b2f' }}>
        Manage and optimize collection routes
      </p>
      <p>Route management content will go here...</p>
    </div>
  );

  const renderTrucks = () => (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>
        Add Trucks
      </h1>
      <p style={{ opacity: 0.6, marginBottom: '25px', color: '#2f6b2f' }}>
        Add and manage truck fleet
      </p>
      <p>Truck management content will go here...</p>
    </div>
  );

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        fontFamily: '"Segoe UI", sans-serif',
        background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)',
        display: 'flex',
        minHeight: '100vh'
      }}
    >
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 50,
            padding: '8px 12px',
            background: '#2f6b2f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {isSidebarOpen && isMobile && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 30
          }}
        />
      )}

      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Admin Panel</h2>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: 0,
          margin: 0,
          flex: 1
        }}>
          {menuItems.slice(0, -1).map((item, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  setActiveMenu(item.name);
                  setIsSidebarOpen(false);
                }}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 8,
                  fontSize: '1.1rem',
                  opacity: activeMenu === item.name ? 1 : 0.85,
                  backgroundColor: activeMenu === item.name ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <button
              onClick={() => {
                setActiveMenu('Logout');
                // Add logout logic here
              }}
              style={{
                background: 'transparent',
                color: '#ffdddd',
                border: 'none',
                padding: '10px 15px',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 8,
                fontSize: '1.1rem',
                opacity: 0.85
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      <main style={{
        flex: 1,
        padding: isMobile ? '70px 24px 24px' : '40px 50px',
        overflowY: 'auto'
      }}>
        {activeMenu === "View All Requests" && renderRequests()}
        {activeMenu === "View Complaints" && renderComplaints()}
        {activeMenu === "Update Schedules" && renderSchedules()}
        {activeMenu === "Update Routes" && renderRoutes()}
        {activeMenu === "Add Trucks" && renderTrucks()}
      </main>
    </div>
  );
}