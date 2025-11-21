import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthSchedule = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);
  const userWard = user?.ward; // Get ward from Redux store

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

  // Filter only user's ward schedule
  const userSchedules = scheduleData.filter(schedule => schedule.ward === userWard);

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: '#ffffff',
      background: 'linear-gradient(to bottom, #7ac37f, #6bb66e)'
    }}>
      {/* Back Button */}
      <div style={{ padding: '20px 60px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '80px 10%'
      }}>
        <h1 style={{ 
          fontSize: '60px', 
          fontFamily: 'Georgia, serif', 
          marginBottom: '15px',
          fontWeight: '700'
        }}>
          Your Pickup Schedule
        </h1>
        <p style={{ 
          fontSize: '22px', 
          maxWidth: '700px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Personalized waste pickup schedule for Ward {userWard}
        </p>
      </section>

      {/* Schedule Section */}
      <section style={{ padding: '70px 12%' }}>
        {/* Ward Info Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            marginBottom: '20px',
            fontFamily: 'Georgia, serif'
          }}>
            Your Ward Information
          </h2>
          <p style={{ fontSize: '20px', marginBottom: '10px' }}>
            <strong>Ward Number:</strong> {userWard}
          </p>
          <p style={{ fontSize: '20px' }}>
            <strong>Resident:</strong> {user?.fullName || user?.email}
          </p>
        </div>

        {/* Schedule Table Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            marginBottom: '25px',
            fontFamily: 'Georgia, serif'
          }}>
            Ward {userWard} Pickup Schedule
          </h2>
          
          {userSchedules.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                marginTop: '25px'
              }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                      textAlign: 'left',
                      fontSize: '20px',
                      fontFamily: 'Georgia, serif'
                    }}>
                      Ward No.
                    </th>
                    <th style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                      textAlign: 'left',
                      fontSize: '20px',
                      fontFamily: 'Georgia, serif'
                    }}>
                      Type of Waste
                    </th>
                    <th style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                      textAlign: 'left',
                      fontSize: '20px',
                      fontFamily: 'Georgia, serif'
                    }}>
                      Pickup Day
                    </th>
                    <th style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                      textAlign: 'left',
                      fontSize: '20px',
                      fontFamily: 'Georgia, serif'
                    }}>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userSchedules.map((schedule) => (
                    <tr key={schedule.ward}>
                      <td style={{
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                        textAlign: 'left',
                        fontSize: '18px'
                      }}>
                        Ward {schedule.ward}
                      </td>
                      <td style={{
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                        textAlign: 'left',
                        fontSize: '18px'
                      }}>
                        {schedule.wasteType}
                      </td>
                      <td style={{
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                        textAlign: 'left',
                        fontSize: '18px'
                      }}>
                        {schedule.day}
                      </td>
                      <td style={{
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
                        textAlign: 'left',
                        fontSize: '18px'
                      }}>
                        {schedule.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '30px',
              fontSize: '20px'
            }}>
              No schedule available for your ward.
            </div>
          )}
        </div>

        {/* Reminder Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            marginBottom: '15px',
            fontFamily: 'Georgia, serif'
          }}>
            📌 Important Reminders
          </h3>
          <ul style={{ 
            listStyleType: 'disc', 
            paddingLeft: '30px',
            lineHeight: '2'
          }}>
            <li>Please segregate your waste according to the type</li>
            <li>Keep your bins ready before the pickup time</li>
            <li>Do not mix different types of waste</li>
            <li>Report any missed pickups through the complaints section</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '25px',
        background: '#5da463',
        marginTop: '40px',
        fontSize: '15px'
      }}>
        © 2025 WasteCare — Clean streets, green minds.
      </footer>
    </div>
  );
};

export default AuthSchedule;