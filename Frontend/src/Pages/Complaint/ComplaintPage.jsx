import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { createComplaint, getMyComplaints, getAllComplaints } from "../../api/complaint";
import { addComplaint, setComplaints, setAllComplaints } from "../../store/complaintSlice";
import { useNavigate } from "react-router-dom";

export default function ComplaintPage() {
  const [activeMenu, setActiveMenu] = useState('Complaints');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', location: '', description: '' });
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { complaints, allComplaints } = useSelector((state) => state.complaint);

  const { isLoading, error } = useQuery({
    queryKey: ["myComplaints"],
    queryFn: getMyComplaints,
    onSuccess: (data) => dispatch(setComplaints(data.complaints || [])),
  });

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
        {name:'MarketPlace' , route:"/marketplace"} 
  ];

  const handleNavigation = (route, itemName) => {
    setActiveMenu(itemName);
    setIsSidebarOpen(false);
    navigate(route);
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
    if (e.target.files[0]) setImageFile(e.target.files[0]);
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
              <a href={item.route} onClick={(e) => { e.preventDefault(); handleNavigation(item.route, item.name); }}
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
              >{item.name}</a>
            </li>
          ))}
        </ul>

      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: isMobile ? '24px' : '40px 50px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>Submit a Complaint</h1>
        <p style={{ opacity: 0.7, marginBottom: '25px', color: '#2f6b2f' }}>Report waste issues in your area. Our team will respond quickly.</p>

        {/* Complaint Form */}
        <div style={{ background: 'rgba(255,255,255,0.85)', padding: '30px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.5)', position: 'relative', overflow: 'hidden' }}>
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
            {imageFile && <span style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>Selected: {imageFile.name}</span>}
          </div>

          <button onClick={handleSubmit} disabled={createMutation.isLoading} style={{ width: '100%', padding: '14px', background: createMutation.isLoading ? '#999' : 'linear-gradient(135deg, #2f6b2f, #3a7d3a)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 600, cursor: createMutation.isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(47,107,47,0.3)', transition: 'all 0.3s ease' }}>
            {createMutation.isLoading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>

        {/* Complaints Table */}
        <h2 style={{ marginBottom: '15px', color: '#1f5520', fontSize: '1.5rem' }}>Your Complaints</h2>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#2f6b2f', fontSize: '1.1rem' }}>Loading complaints...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#ef4444', fontSize: '1.1rem' }}>Failed to load complaints. Please refresh the page.</p>
          </div>
        ) : (
          renderComplaintsTable(complaints)
        )}

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
