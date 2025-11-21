import React, { useState } from 'react';

export default function Payment() {
  const [activeMenu, setActiveMenu] = useState('Payment');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [bills] = useState([
    { month: 'August 2025', amount: 300, paid: true },
    { month: 'September 2025', amount: 300, paid: true },
    { month: 'October 2025', amount: 300, paid: false },
    { month: 'November 2025', amount: 300, paid: false }
  ]);

  // Sidebar menu items
  const menuItems = [
    { name: 'Dashboard', route: '/dash' },
    { name: 'Pickup Requests', route: '/requestPickup' },
    { name: 'Payment', route: '/payment' },
    { name: 'Complaints', route: '/complaints' },
    { name: 'Schedule', route: '/authSchedule' },
    { name: 'Profile', route: '/profile' }, // Keep Profile
  ];

  const handleNavigation = (route, itemName) => {
    setActiveMenu(itemName);
    setIsSidebarOpen(false);
    window.location.href = route;
  };

  const handlePayNow = (month) => {
    alert(`Processing payment for ${month}...`);
  };

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      boxSizing: 'border-box', 
      fontFamily: '"Poppins", sans-serif',
      background: 'linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%)',
      display: 'flex',
      minHeight: '100vh'
    }}>
      {/* Mobile Menu Button */}
      {window.innerWidth < 780 && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 50,
            padding: '8px',
            background: '#2f6b2f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Overlay for mobile */}
      {isSidebarOpen && window.innerWidth < 780 && (
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
      <aside style={{
        position: window.innerWidth < 780 ? 'fixed' : 'static',
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
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        zIndex: 40,
        transform: window.innerWidth < 780 
          ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
          : 'translateX(0)',
        transition: 'transform 0.3s ease-in-out'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          letterSpacing: '-0.5px'
        }}>WasteCare</h2>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: 0,
          margin: 0,
          flex: 1
        }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a 
                href={item.route} 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.route, item.name);
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
                  background: activeMenu === item.name ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== item.name) {
                    e.target.style.opacity = 1;
                    e.target.style.transform = 'translateX(5px)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
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
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: window.innerWidth < 640 ? '24px' : window.innerWidth < 780 ? '32px' : '40px 50px',
        overflowY: 'auto'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px', color: '#1f5520' }}>Payments</h1>
        <p style={{ opacity: 0.6, marginBottom: '25px', color: '#2f6b2f', fontSize: '1rem' }}>
          View your monthly bills and make payments.
        </p>

        {/* Bills Table */}
        <div>
          <h2 style={{ marginBottom: '15px', color: '#1f5520', fontSize: '1.5rem' }}>Monthly Bills</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
              fontSize: '1rem'
            }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #d7ffd2, #c5f5c0)' }}>
                  <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>SN</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Month</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Amount (Rs.)</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Status</th>
                  <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.slice().reverse().map((bill, index) => (
                  <tr key={index} style={{ transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fff8'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>{index + 1}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>{bill.month}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>{bill.amount}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>{bill.paid ? 'Paid' : 'Not Paid'}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>
                      {!bill.paid && (
                        <button
                          onClick={() => handlePayNow(bill.month)}
                          style={{
                            padding: '8px 14px',
                            background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #3a7d3a, #2f6b2f)';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #2f6b2f, #3a7d3a)';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
