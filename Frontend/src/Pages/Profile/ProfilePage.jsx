import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [activeMenu, setActiveMenu] = useState('Profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const user = { name: "John Doe", email: "johndoe@example.com", phone: "9800000000", type: "Residential User" };

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

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box', fontFamily: '"Segoe UI", sans-serif', background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)', display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 50, padding: '8px 12px', background: '#2f6b2f', color: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '20px' }}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Overlay */}
      {isSidebarOpen && isMobile && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }} />
      )}

      {/* Sidebar */}
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

      {/* Main Content */}
      <main style={{ flex: 1, padding: isMobile ? '24px' : '40px 50px', overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ backgroundColor: '#f5f5dc', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          {/* Profile Header */}
          <div style={{ textAlign: 'center', padding: '30px 20px', background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', color: 'white', borderRadius: '10px' }}>
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Profile" style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '50%', border: '5px solid white', marginBottom: '10px' }} />
            <h2 style={{ margin: '5px 0 0', fontSize: '22px', fontWeight: 600 }}>{user.name}</h2>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>{user.type}</p>
          </div>

          {/* Profile Details */}
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '8px', color: '#333', borderLeft: '4px solid #4CAF50', paddingLeft: '10px', fontSize: '17px' }}>Personal Information</h3>
            <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Name:</strong> {user.name}</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Email:</strong> {user.email}</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Phone:</strong> {user.phone}</p>
            </div>

            <h3 style={{ marginBottom: '8px', color: '#333', borderLeft: '4px solid #4CAF50', paddingLeft: '10px', fontSize: '17px' }}>Address</h3>
            <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Province:</strong> No data</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>District:</strong> No data</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Municipality:</strong> No data</p>
            </div>

            <h3 style={{ marginBottom: '8px', color: '#333', borderLeft: '4px solid #4CAF50', paddingLeft: '10px', fontSize: '17px' }}>Waste Service Info</h3>
            <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Last Request:</strong> No data</p>
            </div>

            <h3 style={{ marginBottom: '8px', color: '#333', borderLeft: '4px solid #4CAF50', paddingLeft: '10px', fontSize: '17px' }}>KYC Verification</h3>
            <div style={{ background: '#f7f7f7', padding: '12px 15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#444' }}><strong>Status:</strong> <span style={{ color: '#d97706', fontWeight: 500 }}>Pending</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}