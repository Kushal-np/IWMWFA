import React, { useState } from 'react';

export default function WasteCarePickup() {
  const [activeMenu, setActiveMenu] = useState('Pickup Requests');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [pickups, setPickups] = useState([
    { date: '2025-11-01', type: 'Organic', amount: 250, note: 'Near gate', status: 'Pending', clicks: 0 },
    { date: '2025-11-03', type: 'Plastic & Recyclables', amount: 300, note: 'Separate bag', status: 'Pending', clicks: 0 }
  ]);

  const [formData, setFormData] = useState({
    pickupDate: '',
    wasteType: '',
    pickupAmount: '',
    pickupNote: ''
  });

  const menuItems = [
    { name: 'Dashboard', route: '/dashboard' },
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
    window.location.href = route;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const amount = parseInt(formData.pickupAmount, 10);

    if (!formData.pickupDate || !formData.wasteType || !formData.pickupAmount) {
      alert('Please fill in all required fields.');
      return;
    }

    if (amount <= 200) {
      alert('Pickup amount must be greater than 200 kg.');
      return;
    }

    const newPickup = {
      date: formData.pickupDate,
      type: formData.wasteType,
      amount: amount,
      note: formData.pickupNote,
      status: 'Pending',
      clicks: 0
    };

    setPickups([...pickups, newPickup]);
    setFormData({ pickupDate: '', wasteType: '', pickupAmount: '', pickupNote: '' });
  };

  const handleMarkDone = (index) => {
    if (window.confirm("Click OK to confirm marking as done or Cancel to abort.")) {
      setPickups(prevPickups => {
        const newPickups = [...prevPickups];
        const actualIndex = prevPickups.length - 1 - index;
        newPickups[actualIndex].clicks++;
        
        if (newPickups[actualIndex].clicks >= 2) {
          newPickups[actualIndex].status = 'Completed';
        } else {
          alert('Please confirm again before marking as done.');
        }
        return newPickups;
      });
    }
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
        }}>Pickup Requests</h1>
        <p style={{
          opacity: 0.6,
          marginBottom: '25px',
          color: '#2f6b2f',
          fontSize: '1rem'
        }}>Request pickups and confirm completion (double-check before marking done).</p>

        {/* Request Form Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            marginBottom: '15px',
            color: '#1f5520',
            fontSize: '1.5rem'
          }}>Request a Pickup</h2>
          <div>
            <div style={{
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <label htmlFor="pickupDate" style={{
                marginBottom: '4px',
                fontWeight: 500,
                color: '#1f5520'
              }}>Date</label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <label htmlFor="wasteType" style={{
                marginBottom: '4px',
                fontWeight: 500,
                color: '#1f5520'
              }}>Waste Type</label>
              <select
                id="wasteType"
                name="wasteType"
                value={formData.wasteType}
                onChange={handleInputChange}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select</option>
                <option value="Organic">Organic</option>
                <option value="Plastic & Recyclables">Plastic & Recyclables</option>
                <option value="General Waste">General Waste</option>
              </select>
            </div>
            <div style={{
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <label htmlFor="pickupAmount" style={{
                marginBottom: '4px',
                fontWeight: 500,
                color: '#1f5520'
              }}>Pickup Amount (kg) (estimated)</label>
              <input
                type="number"
                id="pickupAmount"
                name="pickupAmount"
                value={formData.pickupAmount}
                onChange={handleInputChange}
                placeholder="Enter amount in kg"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <label htmlFor="pickupNote" style={{
                marginBottom: '4px',
                fontWeight: 500,
                color: '#1f5520'
              }}>Note (optional)</label>
              <input
                type="text"
                id="pickupNote"
                name="pickupNote"
                value={formData.pickupNote}
                onChange={handleInputChange}
                placeholder="Add a note (e.g., special instructions)"
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
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
              Request Pickup
            </button>
          </div>
        </div>

        {/* Pickup Requests Table */}
        <div>
          <h2 style={{
            marginBottom: '15px',
            color: '#1f5520',
            fontSize: '1.5rem'
          }}>Your Pickup Requests</h2>
          <div style={{ overflowX: 'auto' }}>
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
                  }}>SN</th>
                  <th style={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2f6b2f'
                  }}>Date</th>
                  <th style={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2f6b2f'
                  }}>Waste Type</th>
                  <th style={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2f6b2f'
                  }}>Amount (kg)</th>
                  <th style={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2f6b2f'
                  }}>Note</th>
                  <th style={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2f6b2f'
                  }}>Status</th>
                  <th style={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#2f6b2f'
                  }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pickups.slice().reverse().map((pickup, index) => (
                  <tr key={index} style={{
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f9fff8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}>
                    <td style={{
                      padding: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      textAlign: 'left'
                    }}>{index + 1}</td>
                    <td style={{
                      padding: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      textAlign: 'left'
                    }}>{pickup.date}</td>
                    <td style={{
                      padding: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      textAlign: 'left'
                    }}>{pickup.type}</td>
                    <td style={{
                      padding: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      textAlign: 'left'
                    }}>{pickup.amount}</td>
                    <td style={{
                      padding: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      textAlign: 'left'
                    }}>{pickup.note || '-'}</td>
                    <td style={{
                      padding: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      textAlign: 'left'
                    }}>{pickup.status}</td>
                    <td style={{
                      padding: '16px',
                      borderBottom: '1px solid #e0e0e0',
                      textAlign: 'left'
                    }}>
                      {pickup.status === 'Pending' && (
                        <button
                          onClick={() => handleMarkDone(index)}
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
                          Mark Done
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