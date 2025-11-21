import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Dash() {
    const user = useSelector((store) => store.auth.user);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuItems = [
    'Dashboard',
    'Pickup Requests',
    'Payment',
    'Complaints',
    'Schedule',
    'Profile',
    'Logout'
  ];

  const scheduleData = [
    { day: 'Sunday', time: '8:00 AM', wasteType: 'Organic' },
    { day: 'Tuesday', time: '8:00 AM', wasteType: 'Plastic & Recyclables' },
    { day: 'Thursday', time: '8:00 AM', wasteType: 'General Waste' }
  ];

  return (
    <div className="flex h-screen">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
        }

        body {
          background: linear-gradient(135deg, #e8ffe3 0%, #d0f5d0 100%);
        }

        .sidebar {
          width: 250px;
          background: linear-gradient(180deg, #2f6b2f 0%, #25592b 100%);
          color: white;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .menu {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .menu-item {
          font-size: 1.1rem;
          cursor: pointer;
          opacity: 0.85;
          transition: all 0.3s ease;
          padding: 10px 15px;
          border-radius: 8px;
        }

        .menu-item:hover,
        .menu-item.active {
          opacity: 1;
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.1);
        }

        .logout {
          margin-top: auto;
          color: #ffdddd;
        }

        .logout:hover {
          background: rgba(255, 100, 100, 0.2);
        }

        .main {
          flex: 1;
          padding: 40px 50px;
          overflow-y: auto;
        }

        .main h1 {
          font-size: 2rem;
          margin-bottom: 6px;
          color: #1f5520;
        }

        .subtitle {
          opacity: 0.6;
          margin-bottom: 25px;
          color: #2f6b2f;
        }

        .cards {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          padding: 25px;
          border-radius: 16px;
          width: 280px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.5);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #2f6b2f, #4a9d4a);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .card:hover::before {
          transform: scaleX(1);
        }

        .card h3 {
          margin-bottom: 10px;
          color: #2f6b2f;
          font-size: 1.15rem;
        }

        .card p {
          color: #555;
          margin-bottom: 4px;
        }

        .card strong {
          color: #2f6b2f;
          font-size: 1.1rem;
        }

        .card button {
          margin-top: 12px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #2f6b2f, #3a7d3a);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(47, 107, 47, 0.2);
        }

        .card button:hover {
          background: linear-gradient(135deg, #3a7d3a, #2f6b2f);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(47, 107, 47, 0.3);
        }

        .card button:active {
          transform: translateY(0);
        }

        .section {
          animation: fadeIn 0.6s ease;
        }

        .section h2 {
          margin-bottom: 15px;
          color: #1f5520;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        table th, table td {
          padding: 16px;
          border-bottom: 1px solid #e0e0e0;
          text-align: left;
        }

        table th {
          background: linear-gradient(135deg, #d7ffd2, #c5f5c0);
          font-weight: 600;
          color: #2f6b2f;
        }

        table tr {
          transition: background 0.2s ease;
        }

        table tr:hover {
          background: #f9fff8;
        }

        table tr:last-child td {
          border-bottom: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 780px) {
          .sidebar {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            height: fit-content;
            padding: 20px;
          }

          .menu {
            flex-direction: row;
          }

          .menu-item {
            white-space: nowrap;
          }

          .main {
            padding: 20px;
          }

          .cards {
            justify-content: center;
          }

          table {
            font-size: 0.9rem;
          }

          table th, table td {
            padding: 12px;
          }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">WasteCare</h2>
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${activeMenu === item ? 'active' : ''} ${
                item === 'Logout' ? 'logout' : ''
              }`}
              onClick={() => setActiveMenu(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <h1>Welcome, {user.fullName}</h1>
        <p className="subtitle">Track your waste pickups, payments, and requests.</p>

        {/* DASHBOARD CARDS */}
        <div className="cards">
          <div className="card">
            <h3>Upcoming Pickup</h3>
            <p>Next pickup: <strong>Thursday, 8 AM</strong></p>
            <button onClick={() => setActiveMenu('Schedule')}>View Schedule</button>
          </div>

          <div className="card">
            <h3>Pending Payment</h3>
            <p>Amount Due: <strong>Rs. 300</strong></p>
            <button onClick={() => setActiveMenu('Payment')}>Pay Now</button>
          </div>

          <div className="card">
            <h3>Your Complaints</h3>
            <p>Active complaints: <strong>1</strong></p>
            <button onClick={() => setActiveMenu('Complaints')}>View Complaints</button>
          </div>
        </div>

        {/* SCHEDULE TABLE */}
        <div className="section">
          <h2>Pickup Schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Waste Type</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule.day}</td>
                  <td>{schedule.time}</td>
                  <td>{schedule.wasteType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}