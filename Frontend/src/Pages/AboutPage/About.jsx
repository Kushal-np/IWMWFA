// About.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

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
          maxWidth: '700px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Transforming waste management into a smart, seamless, and eco-friendly experience for everyone.
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
          fontSize: '18px'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '15px',
            fontFamily: 'Georgia, serif'
          }}>
            Our Mission
          </h2>
          <p>
            At WasteCare, we believe every community deserves clean streets, efficient waste systems,
            and a healthier environment. Our mission is to modernize waste management using technology
            and thoughtful design.
          </p>
        </div>

        {/* Who We Are Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '15px',
            fontFamily: 'Georgia, serif'
          }}>
            Who We Are
          </h2>
          <p>
            WasteCare is a digital waste-management platform built for residents and businesses.
            We simplify everyday tasks — from scheduling pickups to tracking recycling habits — making waste
            management effortless and intuitive.
          </p>
        </div>

        {/* What We Do Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '15px',
            fontFamily: 'Georgia, serif'
          }}>
            What We Do
          </h2>
          <ul style={{ 
            listStyle: 'none', 
            paddingLeft: '0',
            fontSize: '18px'
          }}>
            <li style={{ margin: '12px 0' }}>✔ Smart pickup scheduling</li>
            <li style={{ margin: '12px 0' }}>✔ Online bill payments</li>
            <li style={{ margin: '12px 0' }}>✔ Recycling & sorting guidance</li>
            <li style={{ margin: '12px 0' }}>✔ Community impact tracking</li>
          </ul>
        </div>

        {/* Our Vision Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '35px',
          borderRadius: '18px',
          margin: '35px 0',
          lineHeight: '1.7',
          fontSize: '18px'
        }}>
          <h2 style={{ 
            fontSize: '34px', 
            marginBottom: '15px',
            fontFamily: 'Georgia, serif'
          }}>
            Our Vision
          </h2>
          <p>
            A cleaner, greener future where waste is minimized, recycling is maximized, and every citizen
            is empowered to care for the environment.
          </p>
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

export default AboutPage;