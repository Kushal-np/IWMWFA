import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '72px', 
          color: '#920707', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          403
        </h1>
        <h2 style={{ 
          fontSize: '32px', 
          color: '#19421F', 
          marginBottom: '20px' 
        }}>
          Access Denied
        </h2>
        <p style={{ 
          fontSize: '18px', 
          color: '#666', 
          marginBottom: '30px' 
        }}>
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '12px 30px',
            backgroundColor: '#ff9100',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255, 145, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e68200'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff9100'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default UnAuthorized