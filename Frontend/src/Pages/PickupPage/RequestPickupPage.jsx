import React, { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { createPickupRequest } from "../../api/pickupApi";
import { addPickup } from "../../store/pickupSlice";
import { Link } from "react-router-dom";

export default function PickupPage() {
  const [activeMenu, setActiveMenu] = useState('Pickup Requests');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    wasteType: '',
    estimatedQuantity: '',
    preferredDate: '',
    notes: ''
  });

  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Add spinner animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.head.removeChild(styleSheet);
    };
  }, []);

  const dispatch = useDispatch();
  const { pickups } = useSelector((state) => state.pickup);

  // Create pickup mutation
  const createMutation = useMutation({
    mutationFn: createPickupRequest,
    onSuccess: (data) => {
      dispatch(addPickup(data.pickupRequest));
      setFormData({ pickupAddress: '', wasteType: '', estimatedQuantity: '', preferredDate: '', notes: '' });
      alert("Pickup request submitted successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to submit pickup request");
    },
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Menu items
  const menuItems = [
    { name: 'Dashboard', route: '/dash' },
    { name: 'Pickup Requests', route: '/requestPickup' },
    { name: 'Payment', route: '/payment' },
    { name: 'Complaints', route: '/complaints' },
    { name: 'Schedule', route: '/authSchedule' },
    { name: 'Profile', route: '/profile' },
    { name: 'MarketPlace', route: '/marketplace' } 
  ];

  // Function to get display name for menu item
  const getMenuItemDisplayName = (item) => {
    if (item.name === 'Dashboard' && activeMenu === 'Dashboard') {
      return 'Go Back';
    }
    return item.name;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.pickupAddress || !formData.wasteType || !formData.estimatedQuantity || !formData.preferredDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const quantity = parseInt(formData.estimatedQuantity, 10);
    if (quantity <= 200) {
      alert('Pickup amount must be greater than 200 kg.');
      return;
    }

    createMutation.mutate({
      pickupAddress: formData.pickupAddress,
      wasteType: formData.wasteType,
      estimatedQuantity: quantity,
      preferredDate: formData.preferredDate,
      notes: formData.notes
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { background: 'linear-gradient(135deg, #f59e0b, #d97706)' };
      case 'assigned': return { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' };
      case 'completed': return { background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)' };
      case 'cancelled': return { background: 'linear-gradient(135deg, #ef4444, #dc2626)' };
      default: return { background: '#999' };
    }
  };

  const inputStyle = { 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: '1px solid #ccc', 
    fontSize: '1rem', 
    width: '100%', 
    boxSizing: 'border-box' 
  };

  const labelStyle = { 
    marginBottom: '4px', 
    fontWeight: 500, 
    color: '#1f5520' 
  };

  const thStyle = { 
    padding: '14px 16px', 
    borderBottom: '1px solid #e0e0e0', 
    textAlign: 'left', 
    fontWeight: 600, 
    color: '#2f6b2f' 
  };

  const tdStyle = { 
    padding: '14px 16px', 
    borderBottom: '1px solid #e0e0e0' 
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

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      fontFamily: '"Segoe UI", sans-serif', 
      background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)', 
      display: 'flex', 
      minHeight: '100vh' 
    }}>
      {/* Mobile Menu Button */}
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

      {/* Overlay */}
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

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>WasteCare</h2>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: 0,
          margin: 0,
          flex: 1
        }}>
          {menuItems.map((item, i) => (
            <li key={i}>
              <Link 
                to={item.name === 'Pickup Requests' && activeMenu === 'Pickup Requests' ? -1 : item.route}
                onClick={() => {
                  setActiveMenu(item.name);
                  setIsSidebarOpen(false);
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  display: 'block',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  opacity: activeMenu === item.name ? 1 : 0.85,
                  transform: activeMenu === item.name ? 'translateX(5px)' : 'translateX(0)',
                  background: activeMenu === item.name ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== item.name) {
                    e.target.style.opacity = 1;
                    e.target.style.transform = 'translateX(5px)';
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenu !== item.name) {
                    e.target.style.opacity = 0.85;
                    e.target.style.transform = 'translateX(0)';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {getMenuItemDisplayName(item)}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: isMobile ? '24px' : '40px 50px',
        overflowY: 'auto'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>Pickup Requests</h1>
        <p style={{ opacity: 0.6, marginBottom: '25px', color: '#2f6b2f' }}>
          Request pickups for your waste. Admin will assign a truck soon.
        </p>

        {/* Request Form */}
        <div style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)', 
          marginBottom: '30px' 
        }}>
          <h2 style={{ marginBottom: '20px', color: '#1f5520', fontSize: '1.4rem' }}>Request a Pickup</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Pickup Address *</label>
              <input 
                type="text" 
                name="pickupAddress" 
                value={formData.pickupAddress} 
                onChange={handleInputChange} 
                placeholder="Enter pickup address" 
                style={inputStyle} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Preferred Date *</label>
              <input 
                type="date" 
                name="preferredDate" 
                value={formData.preferredDate} 
                onChange={handleInputChange} 
                style={inputStyle} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Waste Type *</label>
              <select 
                name="wasteType" 
                value={formData.wasteType} 
                onChange={handleInputChange} 
                style={inputStyle}
              >
                <option value="">Select</option>
                <option value="Organic-Waste">Organic Waste</option>
                <option value="Recycleable-Waste">Recycleable Waste</option>
                <option value="General-waste">General Waste</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>Estimated Quantity (kg) *</label>
              <input 
                type="number" 
                name="estimatedQuantity" 
                value={formData.estimatedQuantity} 
                onChange={handleInputChange} 
                placeholder="Min 200 kg" 
                style={inputStyle} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: isMobile ? '1' : '1 / -1' }}>
              <label style={labelStyle}>Notes (optional)</label>
              <input 
                type="text" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                placeholder="Special instructions..." 
                style={inputStyle} 
              />
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={createMutation.isLoading}
            style={{ 
              marginTop: '20px', 
              padding: '12px 24px', 
              background: createMutation.isLoading ? '#999' : 'linear-gradient(135deg, #2f6b2f, #3a7d3a)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: createMutation.isLoading ? 'not-allowed' : 'pointer', 
              fontWeight: 600, 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {createMutation.isLoading && (
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            )}
            {createMutation.isLoading ? 'Submitting...' : 'Request Pickup'}
          </button>
        </div>

        {/* Pickup Requests Table */}
        <h2 style={{ marginBottom: '15px', color: '#1f5520', fontSize: '1.4rem' }}>Your Pickup Requests</h2>
        
        <div style={{ 
          overflowX: 'auto', 
          borderRadius: '12px', 
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)' 
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            background: 'white', 
            borderRadius: '12px', 
            overflow: 'hidden' 
          }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #d7ffd2, #c5f5c0)' }}>
                <th style={thStyle}>SN</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Waste Type</th>
                <th style={thStyle}>Quantity (kg)</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Notes</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pickups.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No pickup requests found
                  </td>
                </tr>
              ) : (
                pickups.map((p, i) => (
                  <tr 
                    key={p._id} 
                    style={{ transition: 'background 0.2s' }} 
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fff8'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={tdStyle}>{formatDate(p.preferredDate)}</td>
                    <td style={tdStyle}>{p.wasteType}</td>
                    <td style={tdStyle}>{p.estimatedQuantity}</td>
                    <td style={tdStyle}>{p.pickupAddress}</td>
                    <td style={tdStyle}>{p.notes || '-'}</td>
                    <td style={tdStyle}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        color: 'white', 
                        fontSize: '0.8rem', 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        ...getStatusStyle(p.status) 
                      }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}