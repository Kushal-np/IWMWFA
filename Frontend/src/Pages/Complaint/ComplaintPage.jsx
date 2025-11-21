import React, { useState, useEffect } from 'react';

export default function ComplaintPage() {
  const [activeMenu, setActiveMenu] = useState('Complaints');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', location: '', description: '' });

  const [complaints] = useState([
    { title: 'Garbage not picked up', status: 'Pending', date: '2025-11-18' },
    { title: 'Overflowing bin', status: 'Resolved', date: '2025-11-12' }
  ]);

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
    { name: 'Logout', route: '/logout' }
  ];

  const handleNavigation = (route, itemName) => {
    setActiveMenu(itemName);
    setIsSidebarOpen(false);
    window.location.href = route;
  };

  const handleSubmit = () => {
    if (formData.title && formData.category && formData.description) {
      alert(`Complaint submitted: ${formData.title}`);
      setFormData({ title: '', category: '', location: '', description: '' });
    } else {
      alert('Please fill all required fields');
    }
  };

  const sidebarStyle = {
    position: isMobile ? 'fixed' : 'static', top: 0, left: 0, bottom: 0, width: '250px',
    background: 'linear-gradient(180deg, #2f6b2f 0%, #25592b 100%)', color: 'white',
    padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)', zIndex: 40,
    transform: isMobile ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
    transition: 'transform 0.3s ease-in-out'
  };

  const inputStyle = { padding: '13px 15px', border: '2px solid #e0e0e0', borderRadius: '10px', background: 'white', fontSize: '1rem', width: '100%', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: '"Segoe UI", sans-serif', background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)', display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 50, padding: '8px 12px', background: '#2f6b2f', color: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '20px' }}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {isSidebarOpen && isMobile && <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }} />}

      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>WasteCare</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', padding: 0, margin: 0, flex: 1 }}>
          {menuItems.slice(0, -1).map((item, i) => (
            <li key={i}>
              <a href={item.route} onClick={(e) => { e.preventDefault(); handleNavigation(item.route, item.name); }}
                style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '10px 15px', borderRadius: '8px', fontSize: '1.1rem', opacity: activeMenu === item.name ? 1 : 0.85, transform: activeMenu === item.name ? 'translateX(5px)' : 'translateX(0)', background: activeMenu === item.name ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => { if (activeMenu !== item.name) { e.target.style.opacity = 1; e.target.style.transform = 'translateX(5px)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}}
                onMouseLeave={(e) => { if (activeMenu !== item.name) { e.target.style.opacity = 0.85; e.target.style.transform = 'translateX(0)'; e.target.style.background = 'transparent'; }}}
              >{item.name}</a>
            </li>
          ))}
        </ul>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <a href="/logout" onClick={(e) => { e.preventDefault(); handleNavigation('/logout', 'Logout'); }}
              style={{ color: '#ffdddd', textDecoration: 'none', display: 'block', padding: '10px 15px', borderRadius: '8px', fontSize: '1.1rem', opacity: 0.85, transition: 'all 0.3s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.transform = 'translateX(5px)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.target.style.opacity = 0.85; e.target.style.transform = 'translateX(0)'; e.target.style.background = 'transparent'; }}
            >Logout</a>
          </li>
        </ul>
      </aside>

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
              <option>Missed Pickup</option>
              <option>Overflowing Waste</option>
              <option>Illegal Dumping</option>
              <option>Damaged Bin</option>
              <option>Other Issue</option>
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
            <label style={{ marginBottom: '8px', fontWeight: 600, color: '#2f6b2f', fontSize: '0.95rem' }}>Upload Image</label>
            <input type="file" accept="image/*" style={inputStyle} />
          </div>

          <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(47,107,47,0.3)', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(135deg, #3a7d3a, #2f6b2f)'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(135deg, #2f6b2f, #3a7d3a)'; e.target.style.transform = 'translateY(0)'; }}
          >Submit Complaint</button>
        </div>

        {/* Complaints History */}
        <h2 style={{ marginBottom: '15px', color: '#1f5520', fontSize: '1.5rem' }}>Your Complaints</h2>
        <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #d7ffd2, #c5f5c0)' }}>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', fontWeight: 600, color: '#2f6b2f', textTransform: 'uppercase', fontSize: '0.85rem' }}>Title</th>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', fontWeight: 600, color: '#2f6b2f', textTransform: 'uppercase', fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '14px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', fontWeight: 600, color: '#2f6b2f', textTransform: 'uppercase', fontSize: '0.85rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={i} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fff8'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #e8e8e8' }}>{c.title}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #e8e8e8' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', background: c.status === 'Pending' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #2f6b2f, #3a7d3a)', boxShadow: c.status === 'Pending' ? '0 2px 8px rgba(245,158,11,0.3)' : '0 2px 8px rgba(47,107,47,0.3)' }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #e8e8e8' }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}