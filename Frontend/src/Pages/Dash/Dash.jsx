import React, { useState } from 'react';

export default function Dash() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', route: '/dash' },
    { name: 'Pickup Requests', route: '/requestPickup' },
    { name: 'Payment', route: '/payment' },
    { name: 'Complaints', route: '/complaints' },
    { name: 'Schedule', route: '/schedule' },
    { name: 'Profile', route: '/profile' },
    { name: 'Logout', route: '/logout' }
  ];

  const handleNavigation = (route, itemName) => {
    setActiveMenu(itemName);
    setIsSidebarOpen(false);
    // For actual routing, you would use React Router
    window.location.href = route;
  };

  const scheduleData = [
    { day: 'Sunday', time: '8:00 AM', wasteType: 'Organic' },
    { day: 'Tuesday', time: '8:00 AM', wasteType: 'Plastic & Recyclables' },
    { day: 'Thursday', time: '8:00 AM', wasteType: 'General Waste' }
  ];

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          {menuItems.slice(0, -1).map((item, index) => (
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
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <a 
              href={menuItems[menuItems.length - 1].route}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(menuItems[menuItems.length - 1].route, menuItems[menuItems.length - 1].name);
              }}
              style={{
                color: '#ffdddd',
                textDecoration: 'none',
                display: 'block',
                padding: '10px 15px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                opacity: 0.85,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = 1;
                e.target.style.transform = 'translateX(5px)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 0.85;
                e.target.style.transform = 'translateX(0)';
                e.target.style.background = 'transparent';
              }}
            >
              {menuItems[menuItems.length - 1].name}
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: window.innerWidth < 640 ? '24px' : window.innerWidth < 780 ? '32px' : '40px 50px',
        overflowY: 'auto'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '6px',
          color: '#1f5520'
        }}>Welcome, User</h1>
        <p style={{
          opacity: 0.6,
          marginBottom: '25px',
          color: '#2f6b2f',
          fontSize: '1rem'
        }}>Track your waste pickups, payments, and requests.</p>

        {/* Dashboard Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 640 
            ? '1fr' 
            : window.innerWidth < 1024 
              ? 'repeat(2, 1fr)' 
              : 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Card 1 - Upcoming Pickup */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
            e.currentTarget.querySelector('.card-border').style.transform = 'scaleX(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
            e.currentTarget.querySelector('.card-border').style.transform = 'scaleX(0)';
          }}
          >
            <div className="card-border" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2f6b2f, #4a9d4a)',
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease'
            }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2f6b2f', marginBottom: '12px' }}>
              Upcoming Pickup
            </h3>
            <p style={{ color: '#666', marginBottom: '4px' }}>Next pickup:</p>
            <p style={{ color: '#2f6b2f', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Thursday, 8 AM
            </p>
            <button
              onClick={() => handleNavigation('/schedule', 'Schedule')}
              style={{
                width: '100%',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(47, 107, 47, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #3a7d3a, #2f6b2f)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(47, 107, 47, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2f6b2f, #3a7d3a)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(47, 107, 47, 0.2)';
              }}
            >
              View Schedule
            </button>
          </div>

          {/* Card 2 - Pending Payment */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
            e.currentTarget.querySelector('.card-border').style.transform = 'scaleX(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
            e.currentTarget.querySelector('.card-border').style.transform = 'scaleX(0)';
          }}
          >
            <div className="card-border" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2f6b2f, #4a9d4a)',
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease'
            }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2f6b2f', marginBottom: '12px' }}>
              Pending Payment
            </h3>
            <p style={{ color: '#666', marginBottom: '4px' }}>Amount Due:</p>
            <p style={{ color: '#2f6b2f', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Rs. 300
            </p>
            <button
              onClick={() => handleNavigation('/payment', 'Payment')}
              style={{
                width: '100%',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(47, 107, 47, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #3a7d3a, #2f6b2f)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(47, 107, 47, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2f6b2f, #3a7d3a)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(47, 107, 47, 0.2)';
              }}
            >
              Pay Now
            </button>
          </div>

          {/* Card 3 - Complaints */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
            e.currentTarget.querySelector('.card-border').style.transform = 'scaleX(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
            e.currentTarget.querySelector('.card-border').style.transform = 'scaleX(0)';
          }}
          >
            <div className="card-border" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2f6b2f, #4a9d4a)',
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease'
            }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2f6b2f', marginBottom: '12px' }}>
              Your Complaints
            </h3>
            <p style={{ color: '#666', marginBottom: '4px' }}>Active complaints:</p>
            <p style={{ color: '#2f6b2f', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '16px' }}>
              1
            </p>
            <button
              onClick={() => handleNavigation('/complaints', 'Complaints')}
              style={{
                width: '100%',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #2f6b2f, #3a7d3a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(47, 107, 47, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #3a7d3a, #2f6b2f)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(47, 107, 47, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2f6b2f, #3a7d3a)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(47, 107, 47, 0.2)';
              }}
            >
              View Complaints
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div>
          <h2 style={{
            marginBottom: '15px',
            color: '#1f5520',
            fontSize: '1.5rem'
          }}>Pickup Schedule</h2>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            fontSize: '1rem',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #d7ffd2, #c5f5c0)'
              }}>
                <th style={{
                  padding: '16px',
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#2f6b2f'
                }}>Day</th>
                <th style={{
                  padding: '16px',
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#2f6b2f'
                }}>Time</th>
                <th style={{
                  padding: '16px',
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#2f6b2f'
                }}>Waste Type</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((schedule, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: index !== scheduleData.length - 1 ? '1px solid #e0e0e0' : 'none',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fff8'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px' }}>{schedule.day}</td>
                  <td style={{ padding: '16px' }}>{schedule.time}</td>
                  <td style={{ padding: '16px' }}>{schedule.wasteType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}