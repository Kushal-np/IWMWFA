// Schedule.jsx (Public - Non-logged in version)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Schedule = () => {
  const navigate = useNavigate();
  const [searchWard, setSearchWard] = useState('');

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

  // Filter schedules based on search
  const filteredSchedules = scheduleData.filter(schedule => {
    if (!searchWard.trim()) return true;
    const searchValue = searchWard.toLowerCase().trim();
    const wardString = `ward ${schedule.ward}`.toLowerCase();
    return wardString === searchValue || schedule.ward.toString() === searchValue;
  });

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5f3f 50%, #1f3a29 100%)'
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
          Pickup Schedule
        </h1>
        <p style={{ 
          fontSize: '22px', 
          maxWidth: '700px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Search your ward number to check the waste pickup day and timing.
        </p>
      </section>

      {/* Schedule Section */}
      <section style={{ padding: '70px 12%' }}>
        {/* Search Card */}
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
            Search Ward
          </h2>
          <input
            type="text"
            list="wardList"
            placeholder="Type or select ward number (1–33)"
            value={searchWard}
            onChange={(e) => setSearchWard(e.target.value)}
            style={{
              width: '50%',
              padding: '12px 18px',
              fontSize: '18px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              color: '#333'
            }}
          />
          <datalist id="wardList">
            {Array.from({ length: 33 }, (_, i) => i + 1).map(num => (
              <option key={num} value={`Ward ${num}`} />
            ))}
          </datalist>
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
            Ward-wise Pickup Schedule
          </h2>
          
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
                {filteredSchedules.map((schedule) => (
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

          {filteredSchedules.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '30px',
              fontSize: '20px'
            }}>
              No results found for "{searchWard}"
            </div>
          )}
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

export default Schedule;


