import React, { useState } from 'react';

export default function AuthSchedule() {
  const [activeMenu, setActiveMenu] = useState('Schedule');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock user data - in real app this would come from Redux
  const user = {
    fullName: 'User Name',
    ward: 5
  };

  // Sidebar menu items
  const menuItems = [
    { name: 'Dashboard', route: '/dash' },
    { name: 'Pickup Requests', route: '/requestPickup' },
    { name: 'Payment', route: '/payment' },
    { name: 'Complaints', route: '/complaints' },
    { name: 'Schedule', route: '/schedule' },
    { name: 'Profile', route: '/profile' }, // Keep Profile
    {name:'MarketPlace' , route:"/marketplace"} 
  ];

  const handleNavigation = (route, itemName) => {
    setActiveMenu(itemName);
    setIsSidebarOpen(false);
    window.location.href = route;
  };

  // Generate schedule data for wards 1-33
  const generateScheduleData = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const wasteTypes = ["Organic", "Recyclables", "General Waste"];
    const schedules = [];

    for (let i = 1; i <= 33; i++) {
      schedules.push({
        ward: i,
        wasteType: wasteTypes[i % 3],
        day: days[i % 6],
        time: i % 2 === 0 ? "8:00 AM – 11:00 AM" : "7:00 AM – 10:00 AM"
      });
    }
    return schedules;
  };

  const scheduleData = generateScheduleData();
  const userSchedules = scheduleData.filter(schedule => schedule.ward === user.ward);

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
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '6px',
          color: '#1f5520'
        }}>Pickup Schedule</h1>
        <p style={{
          opacity: 0.6,
          marginBottom: '25px',
          color: '#2f6b2f',
          fontSize: '1rem'
        }}>Personalized waste pickup schedule for Ward {user.ward}</p>

        {/* Ward Info Card */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#1f5520'
          }}>
            Your Ward Information
          </h2>
          <p style={{ 
            fontSize: '1.1rem',
            marginBottom: '8px',
            color: '#2f6b2f'
          }}>
            <strong>Ward Number:</strong> {user.ward}
          </p>
          <p style={{ 
            fontSize: '1.1rem',
            color: '#2f6b2f'
          }}>
            <strong>Resident:</strong> {user.fullName}
          </p>
        </div>

        {/* Schedule Table */}
        <div>
          <h2 style={{
            marginBottom: '15px',
            color: '#1f5520',
            fontSize: '1.5rem'
          }}>Ward {user.ward} Pickup Schedule</h2>
          
          {userSchedules.length > 0 ? (
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
                    <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Ward No.</th>
                    <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Type of Waste</th>
                    <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Pickup Day</th>
                    <th style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left', fontWeight: 600, color: '#2f6b2f' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userSchedules.map((schedule) => (
                    <tr key={schedule.ward} style={{ transition: 'background 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fff8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>Ward {schedule.ward}</td>
                      <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>{schedule.wasteType}</td>
                      <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>{schedule.day}</td>
                      <td style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>{schedule.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
              No schedule available for your ward.
            </div>
          )}
        </div>

        {/* Reminder Card */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginTop: '24px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#1f5520' }}>
            📌 Important Reminders
          </h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '30px', lineHeight: '1.8', color: '#2f6b2f' }}>
            <li>Please segregate your waste according to the type</li>
            <li>Keep your bins ready before the pickup time</li>
            <li>Do not mix different types of waste</li>
            <li>Report any missed pickups through the complaints section</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
