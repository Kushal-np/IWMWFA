// About.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #0d1f17 0%, #1a3a2e 50%, #0f2419 100%)'
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
          About WasteCare
        </h1>
        <p style={{ 
          fontSize: '22px', 
          maxWidth: '800px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          WasteCare is the official digital platform for streamlined waste management. It enables residents and businesses to manage waste responsibly, access municipal services, and contribute to a cleaner, healthier community.
        </p>
      </section>

      {/* About Section */}
      <section style={{ padding: '70px 12%' }}>
        {/* Our Mission Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '15px',
            fontFamily: 'Georgia, serif',
            color: '#a8e6a3'
          }}>
            Our Mission
          </h2>
          <p>
            Our mission is to ensure efficient, transparent, and sustainable waste management across the city. By integrating technology with municipal services, WasteCare helps communities reduce waste, increase recycling, and maintain cleaner neighborhoods.
          </p>
        </div>

        {/* Who We Are Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '15px',
            fontFamily: 'Georgia, serif',
            color: '#a8e6a3'
          }}>
            Who We Are
          </h2>
          <p>
            WasteCare is a government-backed digital platform designed for residents, commercial establishments, and local authorities. It provides tools to schedule waste collection, report issues, track recycling, and access official guidelines on waste management.
          </p>
        </div>

        {/* What We Do Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '20px',
            fontFamily: 'Georgia, serif',
            color: '#a8e6a3'
          }}>
            What We Do
          </h2>
          <ul style={{ 
            listStyle: 'none', 
            paddingLeft: '0',
            fontSize: '18px'
          }}>
            <li style={{ 
              margin: '16px 0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ color: '#a8e6a3', fontSize: '24px', fontWeight: 'bold' }}>•</span>
              <div>
                <strong style={{ color: '#a8e6a3' }}>Scheduled Waste Collection:</strong> Residents and businesses can book and manage timely waste pickups.
              </div>
            </li>
            <li style={{ 
              margin: '16px 0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ color: '#a8e6a3', fontSize: '24px', fontWeight: 'bold' }}>•</span>
              <div>
                <strong style={{ color: '#a8e6a3' }}>Online Payments & Service Requests:</strong> Securely pay municipal waste charges and submit service requests online.
              </div>
            </li>
            <li style={{ 
              margin: '16px 0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ color: '#a8e6a3', fontSize: '24px', fontWeight: 'bold' }}>•</span>
              <div>
                <strong style={{ color: '#a8e6a3' }}>Recycling & Sorting Guidelines:</strong> Access official guidance to segregate waste correctly and reduce landfill impact.
              </div>
            </li>
            <li style={{ 
              margin: '16px 0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ color: '#a8e6a3', fontSize: '24px', fontWeight: 'bold' }}>•</span>
              <div>
                <strong style={{ color: '#a8e6a3' }}>Community Reports & Insights:</strong> Track collective recycling efforts, waste reduction statistics, and city-wide impact.
              </div>
            </li>
          </ul>
        </div>

        {/* Our Vision Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '15px',
            fontFamily: 'Georgia, serif',
            color: '#a8e6a3'
          }}>
            Our Vision
          </h2>
          <p>
            WasteCare envisions a city where waste is minimized, resources are efficiently managed, and all citizens participate in sustainable practices. Our goal is to promote a cleaner, greener, and more livable urban environment for everyone.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 25px',
        background: 'linear-gradient(135deg, #4a9c5a 0%, #3d8249 100%)',
        marginTop: '40px',
        fontSize: '15px',
        fontWeight: '500',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <p style={{ margin: '0' }}>
          © 2025 WasteCare — Official e-governance platform for municipal waste management.
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;