import React, { useState } from "react";
import Back from "../../assets/back.png";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { useMutation } from "@tanstack/react-query";
import { loginUser, signupUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export const AuthenticationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // "login" or "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false });
  const [signupData, setSignupData] = useState({ fullName: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setShowPassword(false);
  };

  const loginMutation = useMutation({
    mutationFn: () => loginUser(loginData),
    onSuccess: (data) => {
      // Only dispatch user data, cookie is automatically set by server
      dispatch(setUser({ user: data.user }));
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Login failed");
    },
  });

  const signupMutation = useMutation({
    mutationFn: () => signupUser(signupData),
    onSuccess: (data) => {
      // Only dispatch user data, cookie is automatically set by server
      dispatch(setUser({ user: data.user }));
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Signup failed");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    signupMutation.mutate();
  };

  return (
    <div style={{
      margin: 0,
      fontFamily: "'Segoe UI', sans-serif",
      background: `url(${Back}) center/cover no-repeat`,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(245, 245, 220, 0.98)',
        borderRadius: '20px',
        padding: '0',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden'
      }}>
        {/* Tab Headers */}
        <div style={{
          display: 'flex',
          borderBottom: '3px solid #19421F'
        }}>
          <button
            onClick={() => switchTab("login")}
            style={{
              flex: 1,
              padding: '18px',
              border: 'none',
              backgroundColor: activeTab === "login" ? '#19421F' : 'transparent',
              color: activeTab === "login" ? 'white' : '#19421F',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderTopLeftRadius: '20px'
            }}
          >
            Login
          </button>
          <button
            onClick={() => switchTab("signup")}
            style={{
              flex: 1,
              padding: '18px',
              border: 'none',
              backgroundColor: activeTab === "signup" ? '#19421F' : 'transparent',
              color: activeTab === "signup" ? 'white' : '#19421F',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderTopRightRadius: '20px'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '30px' }}>
          {activeTab === "login" ? (
            // Login Form
            <div>
              <h2 style={{ 
                textAlign: 'center', 
                color: '#19421F', 
                marginBottom: '25px',
                fontSize: '28px',
                fontWeight: 'bold'
              }}>
                Welcome Back
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#19421F',
                  fontSize: '14px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #920707',
                    boxSizing: 'border-box',
                    fontSize: '15px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4BB050'}
                  onBlur={(e) => e.target.style.borderColor = '#920707'}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#19421F',
                  fontSize: '14px'
                }}>
                  Password
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #920707',
                      boxSizing: 'border-box',
                      fontSize: '15px',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4BB050'}
                    onBlur={(e) => e.target.style.borderColor = '#920707'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: '12px 18px',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: '#4BB050',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3a9040'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4BB050'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '20px' 
              }}>
                <input
                  type="checkbox"
                  id="remember-login"
                  checked={loginData.remember}
                  onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
                  style={{ 
                    width: '18px', 
                    height: '18px', 
                    cursor: 'pointer',
                    accentColor: '#4BB050'
                  }}
                />
                <label htmlFor="remember-login" style={{ 
                  color: '#19421F', 
                  fontWeight: '500',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  Remember me
                </label>
              </div>
              
              {error && (
                <div style={{ 
                  color: '#ff4d4d', 
                  textAlign: 'center', 
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#ffe6e6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loginMutation.isPending}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: loginMutation.isPending ? '#ccc' : '#ff9100',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loginMutation.isPending ? 'not-allowed' : 'pointer',
                  marginTop: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255, 145, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loginMutation.isPending) e.target.style.backgroundColor = '#e68200';
                }}
                onMouseLeave={(e) => {
                  if (!loginMutation.isPending) e.target.style.backgroundColor = '#ff9100';
                }}
              >
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </button>
            </div>
          ) : (
            // Signup Form
            <div>
              <h2 style={{ 
                textAlign: 'center', 
                color: '#19421F', 
                marginBottom: '25px',
                fontSize: '28px',
                fontWeight: 'bold'
              }}>
                Create Account
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#19421F',
                  fontSize: '14px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #920707',
                    boxSizing: 'border-box',
                    fontSize: '15px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4BB050'}
                  onBlur={(e) => e.target.style.borderColor = '#920707'}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#19421F',
                  fontSize: '14px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #920707',
                    boxSizing: 'border-box',
                    fontSize: '15px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4BB050'}
                  onBlur={(e) => e.target.style.borderColor = '#920707'}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#19421F',
                  fontSize: '14px'
                }}>
                  Password
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #920707',
                      boxSizing: 'border-box',
                      fontSize: '15px',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4BB050'}
                    onBlur={(e) => e.target.style.borderColor = '#920707'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      padding: '12px 18px',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: '#4BB050',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3a9040'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4BB050'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#19421F',
                  fontSize: '14px'
                }}>
                  Role
                </label>
                <select
                  value={signupData.role}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #920707',
                    boxSizing: 'border-box',
                    fontSize: '15px',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4BB050'}
                  onBlur={(e) => e.target.style.borderColor = '#920707'}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {error && (
                <div style={{ 
                  color: '#ff4d4d', 
                  textAlign: 'center', 
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#ffe6e6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleSignup}
                disabled={signupMutation.isPending}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: signupMutation.isPending ? '#ccc' : '#ff9100',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: signupMutation.isPending ? 'not-allowed' : 'pointer',
                  marginTop: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255, 145, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!signupMutation.isPending) e.target.style.backgroundColor = '#e68200';
                }}
                onMouseLeave={(e) => {
                  if (!signupMutation.isPending) e.target.style.backgroundColor = '#ff9100';
                }}
              >
                {signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;