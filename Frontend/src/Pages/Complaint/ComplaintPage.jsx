import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { createComplaint, getMyComplaints, getAllComplaints } from "../../api/complaint";
import { addComplaint, setComplaints, setAllComplaints } from "../../store/complaintSlice";
import { Link } from "react-router-dom";

export default function ComplaintPage() {
  const [activeMenu, setActiveMenu] = useState('Complaints');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', location: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Add spinner animation globally
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
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { allComplaints } = useSelector((state) => state.complaint);

  const { isLoading: isLoadingAll } = useQuery({
    queryKey: ["allComplaints"],
    queryFn: getAllComplaints,
    enabled: user?.role === "admin",
    onSuccess: (data) => dispatch(setAllComplaints(data.complaints || [])),
  });

  const createMutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: (data) => {
      dispatch(addComplaint(data.complaint));
      queryClient.invalidateQueries(["myComplaints"]);
      if (user?.role === "admin") queryClient.invalidateQueries(["allComplaints"]);
      setFormData({ title: '', category: '', location: '', description: '' });
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      alert("Complaint submitted successfully!");
    },
    onError: (error) => alert(error.response?.data?.message || "Failed to submit complaint"),
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { name: 'Dashboard', route: '/dash' },
    { name: 'Pickup Requests', route: '/requestPickup' },
    { name: 'Payment', route: '/payment' },
    { name: 'Complaints', route: '/complaints' },
    { name: 'Schedule', route: '/authSchedule' },
    { name: 'Profile', route: '/profile' },
    { name: 'MarketPlace', route: '/marketplace' } 
  ];

  const getMenuItemDisplayName = (item) => {
  if (item.name === 'Dashboard' && activeMenu === 'Pickup Requests') {
    return 'Go Back';
  }
  return item.name;
};

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.description) {
      alert('Please fill all required fields (Title, Category, and Description)');
      return;
    }
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('location', formData.location);
    submitData.append('description', formData.description);
    if (imageFile) submitData.append('image', imageFile);
    createMutation.mutate(submitData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 2px 8px rgba(245,158,11,0.3)' };
      case 'verified': return { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' };
      case 'resolved': return { background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)', boxShadow: '0 2px 8px rgba(47,107,47,0.3)' };
      default: return { background: '#999' };
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

  const inputStyle = { padding: '13px 15px', border: '2px solid #e0e0e0', borderRadius: '10px', background: 'white', fontSize: '1rem', width: '100%', outline: 'none', boxSizing: 'border-box' };

  const tableHeaderStyle = { padding: '14px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', fontWeight: 600, color: '#2f6b2f', textTransform: 'uppercase', fontSize: '0.85rem' };
  const tableCellStyle = { padding: '14px 16px', borderBottom: '1px solid #e8e8e8' };

  const renderComplaintsTable = (complaintsData, showUser = false) => (
    <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #d7ffd2, #c5f5c0)' }}>
            {showUser && <th style={tableHeaderStyle}>User</th>}
            <th style={tableHeaderStyle}>Title</th>
            <th style={tableHeaderStyle}>Category</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {complaintsData.length === 0 ? (
            <tr><td colSpan={showUser ? 5 : 4} style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No complaints found</td></tr>
          ) : (
            complaintsData.map((c) => (
              <tr key={c._id} style={{ transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fff8'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                {showUser && <td style={tableCellStyle}>{c.user?.fullName || 'N/A'}</td>}
                <td style={tableCellStyle}>{c.title}</td>
                <td style={tableCellStyle}>{c.category}</td>
                <td style={tableCellStyle}>
                  <span style={{ padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', ...getStatusStyle(c.status) }}>{c.status}</span>
                </td>
                <td style={tableCellStyle}>{formatDate(c.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: '"Segoe UI", sans-serif', background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)', display: 'flex', minHeight: '100vh' }}>
      {/* Mobile toggle button */}
      {isMobile && (
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 50, padding: '8px 12px', background: '#2f6b2f', color: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '20px' }}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Mobile overlay */}
      {isSidebarOpen && isMobile && <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }} />}

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>WasteCare</h2>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', padding: 0, margin: 0, flex: 1 }}>
          {menuItems.map((item, i) => (
            <li key={i}>
              <Link 
                to={item.route}
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
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: isMobile ? '24px' : '40px 50px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>Submit a Complaint</h1>
        <p style={{ opacity: 0.7, marginBottom: '25px', color: '#2f6b2f' }}>Report waste issues in your area. Our team will respond quickly.</p>

        {/* Complaint Form */}
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '35px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #2f6b2f, #4a9d4a)' }} />

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontWeight: 600, color: '#2f6b2f', fontSize: '0.95rem' }}>Complaint Title *</label>
            <input type="text" placeholder="e.g., Garbage not picked up" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontWeight: 600, color: '#2f6b2f', fontSize: '0.95rem' }}>Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle}>
              <option value="">Select category</option>
              <option value="Missed-Pickup">Missed Pickup</option>
              <option value="Overflow-Waste">Overflowing Waste</option>
              <option value="Illegal-Dumping">Illegal Dumping</option>
              <option value="Damaged-Bin">Damaged Bin</option>
              <option value="Other-Issue">Other Issue</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontWeight: 600, color: '#2f6b2f', fontSize: '0.95rem' }}>Location</label>
            <input type="text" placeholder="Enter address / street / landmark" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontWeight: 600, color: '#2f6b2f', fontSize: '0.95rem' }}>Description *</label>
            <textarea rows="4" placeholder="Describe the issue..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '8px', fontWeight: 600, color: '#2f6b2f', fontSize: '0.95rem' }}>Upload Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
            
            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginTop: '15px', position: 'relative', display: 'inline-block' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '200px', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '12px', 
                    border: '2px solid #e0e0e0',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }} 
                />
                <button
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  title="Remove image"
                >
                  ×
                </button>
                <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>{imageFile?.name}</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={createMutation.isLoading} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: createMutation.isLoading ? '#999' : 'linear-gradient(135deg, #2f6b2f, #3a7d3a)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              cursor: createMutation.isLoading ? 'not-allowed' : 'pointer', 
              boxShadow: '0 4px 12px rgba(47,107,47,0.3)', 
              transition: 'all 0.3s ease',
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
            {createMutation.isLoading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>

        {/* Admin - All Complaints */}
        {user?.role === 'admin' && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ marginBottom: '15px', color: '#1f5520', fontSize: '1.5rem' }}>All User Complaints (Admin)</h2>
            {isLoadingAll ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <p style={{ color: '#2f6b2f', fontSize: '1.1rem' }}>Loading all complaints...</p>
              </div>
            ) : (
              renderComplaintsTable(allComplaints, true)
            )}
          </div>
        )}
      </main>
    </div>
  );
}