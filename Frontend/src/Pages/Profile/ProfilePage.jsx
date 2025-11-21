import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../../api/auth.js";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [activeMenu, setActiveMenu] = useState('Profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ address: '', ward_no: '' });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profileData?.user) {
      setFormData({
        address: profileData.user.address || '',
        ward_no: profileData.user.ward_no || ''
      });
    }
  }, [profileData]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      setIsEditing(false);
      alert("Profile updated successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update profile");
    },
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
  ];

  const handleNavigation = (route, itemName) => {
    setActiveMenu(itemName);
    setIsSidebarOpen(false);
    navigate(route);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updateData = {};
    if (formData.address) updateData.address = formData.address;
    if (formData.ward_no) updateData.ward_no = parseInt(formData.ward_no);

    if (Object.keys(updateData).length === 0) {
      alert("Please provide at least one field to update");
      return;
    }

    updateMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setFormData({
      address: profileData?.user.address || '',
      ward_no: profileData?.user.ward_no || ''
    });
    setIsEditing(false);
  };

  const sidebarStyle = {
    position: isMobile ? 'fixed' : 'static',
    top: 0, left: 0, bottom: 0,
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

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)' }}><p style={{ fontSize: '1.2rem', color: '#2f6b2f' }}>Loading profile...</p></div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)' }}><p style={{ fontSize: '1.2rem', color: '#ef4444' }}>Error loading profile. Please try again.</p></div>;

  const user = profileData?.user;

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box', fontFamily: '"Segoe UI", sans-serif', background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)', display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 50, padding: '8px 12px', background: '#2f6b2f', color: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '20px' }}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Overlay */}
      {isSidebarOpen && isMobile && <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }} />}

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>WasteCare</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', padding: 0, margin: 0, flex: 1 }}>
          {menuItems.map((item, i) => (
            <li key={i}>
              <a href={item.route} onClick={(e) => { e.preventDefault(); handleNavigation(item.route, item.name); }}
                style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '10px 15px', borderRadius: '8px', fontSize: '1.1rem', opacity: activeMenu === item.name ? 1 : 0.85, transform: activeMenu === item.name ? 'translateX(5px)' : 'translateX(0)', background: activeMenu === item.name ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => { if (activeMenu !== item.name) { e.target.style.opacity = 1; e.target.style.transform = 'translateX(5px)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}}
                onMouseLeave={(e) => { if (activeMenu !== item.name) { e.target.style.opacity = 0.85; e.target.style.transform = 'translateX(0)'; e.target.style.background = 'transparent'; }}}
              >{item.name}</a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: isMobile ? '24px' : '40px 50px', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ backgroundColor: '#f5f5dc', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          {/* Profile Header */}
          <div style={{ textAlign: 'center', padding: '30px 20px', background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', color: 'white', borderRadius: '10px' }}>
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Profile" style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '50%', border: '5px solid white', marginBottom: '10px' }} />
            <h2 style={{ margin: '5px 0 0', fontSize: '22px', fontWeight: 600 }}>{user?.fullName}</h2>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>{user?.role === 'business' ? 'Business User' : user?.role === 'admin' ? 'Administrator' : 'Residential User'}</p>
          </div>

          {/* Profile Details */}
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '8px', color: '#333', borderLeft: '4px solid #4CAF50', paddingLeft: '10px', fontSize: '17px' }}>Personal Information</h3>
            <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Name:</strong> {user?.fullName}</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Email:</strong> {user?.email}</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Role:</strong> {user?.role}</p>
            </div>

            <h3 style={{ marginBottom: '8px', color: '#333', borderLeft: '4px solid #4CAF50', paddingLeft: '10px', fontSize: '17px' }}>Address & Location</h3>
            {isEditing ? (
              <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500, color: '#333' }}>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your address" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500, color: '#333' }}>Ward Number</label>
                  <input type="number" name="ward_no" value={formData.ward_no} onChange={handleInputChange} placeholder="Enter ward number" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={handleSubmit} disabled={updateMutation.isLoading} style={{ flex: 1, padding: '8px 16px', background: updateMutation.isLoading ? '#999' : '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: updateMutation.isLoading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}>{updateMutation.isLoading ? 'Saving...' : 'Save'}</button>
                  <button onClick={handleCancel} disabled={updateMutation.isLoading} style={{ flex: 1, padding: '8px 16px', background: '#999', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Address:</strong> {user?.address || 'Not provided'}</p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Ward No:</strong> {user?.ward_no || 'Not provided'}</p>
                <button onClick={() => setIsEditing(true)} style={{ marginTop: '10px', padding: '6px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Edit Address</button>
              </div>
            )}

            <h3 style={{ marginBottom: '8px', color: '#333', borderLeft: '4px solid #4CAF50', paddingLeft: '10px', fontSize: '17px' }}>Account Info</h3>
            <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Last Updated:</strong> {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
