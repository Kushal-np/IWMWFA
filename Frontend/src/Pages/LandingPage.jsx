import React, { useState, useEffect } from 'react';
import landing from "../assets/landing.png"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice'; // Import logout action

export default function WasteCare() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Only log if user exists
  useEffect(() => {
    if (user) {
      console.log('Logged in user:', user.email);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const navbar = document.querySelector('.navbar');
      if (navbar && !navbar.contains(e.target) && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <style>{`
        :root {
          --hero-height: 100vh;
          --overlay-start: rgba(255,255,255,0.02);
          --overlay-end: rgba(255,255,255,0.06);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          font-family: "Poppins", sans-serif;
          overflow-x: hidden;
        }

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 15px clamp(20px, 5vw, 50px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: rgba(255,255,255,0.15);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .logo {
          font-size: clamp(1.2rem, 4vw, 1.8rem);
          font-weight: 800;
          color: white;
          letter-spacing: 1px;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
          z-index: 101;
          background: none;
          border: none;
          padding: 5px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: white;
          transition: 0.3s;
          border-radius: 2px;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        .nav-links {
          list-style: none;
          display: flex;
          gap: clamp(15px, 2.5vw, 35px);
          align-items: center;
        }

        .nav-links li a, .nav-links li button {
          text-decoration: none;
          color: white;
          font-weight: 500;
          padding: 8px 16px;
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          border-radius: 6px;
          transition: 0.3s ease;
          display: block;
          cursor: pointer;
          border: none;
          background: none;
          font-family: "Poppins", sans-serif;
        }

        .nav-links li a:hover, .nav-links li button:hover {
          background: rgba(212, 255, 212, 0.25);
          color: #1e431e;
        }

        .login-btn {
          background: white;
          color: #2f6b2f !important;
          border-radius: 8px;
          font-weight: 600;
        }

        .login-btn:hover {
          background: #d4ffd4;
        }

        .logout-btn {
          background: #ff4444;
          color: white !important;
          border-radius: 8px;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: #cc0000 !important;
          color: white !important;
        }

        .hero {
          min-height: var(--hero-height);
          width: 100%;
          padding-top: clamp(100px, 15vh, 120px);
          padding-bottom: clamp(40px, 8vh, 80px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(180deg, var(--overlay-start), var(--overlay-end)),
            url(${landing}) no-repeat right center;
          background-size: cover;
        }

        .hero::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 12%;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.06));
        }

        .hero-text {
          position: relative;
          margin-top: clamp(20px, 8vh, 60px);
          margin-left: clamp(20px, 5vw, 5%);
          margin-right: clamp(20px, 5vw, 5%);
          color: white;
          max-width: min(650px, 90%);
          text-align: left;
          z-index: 3;
        }

        .hero-text h1 {
          font-size: clamp(2.2rem, 8vw, 5rem);
          font-family: Georgia, serif;
          font-weight: 800;
          margin-bottom: clamp(0.5rem, 2vh, 1rem);
          line-height: 1.1;
        }

        .hero-text p {
          font-size: clamp(1rem, 3vw, 1.8rem);
          font-family: Georgia, serif;
          font-weight: 500;
          line-height: 1.4;
        }

        @media (min-width: 721px) {
          .hero-text p {
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid #d4ffd4;
            width: 0;
            animation: typing 4s steps(120, end) forwards, blink 0.75s step-end infinite;
            animation-delay: 0.5s;
          }
        }

        .box {
          max-width: min(550px, 90%);
          padding: clamp(20px, 4vw, 32px);
          margin-left: clamp(20px, 5vw, 5%);
          margin-right: clamp(20px, 5vw, 5%);
          margin-top: auto;
          margin-bottom: clamp(30px, 8vh, 60px);
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(9px);
          border-radius: 16px;
          color: white;
          font-family: Georgia, serif;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          opacity: 0;
          animation: fadeInBox 1.5s ease forwards;
          animation-delay: 2.5s;
          line-height: 1.6;
          font-size: clamp(0.9rem, 2vw, 1.2rem);
          z-index: 3;
        }

        .mobile-image {
          display: none;
          width: 100%;
          max-width: 500px;
          height: auto;
          margin: 30px auto;
          z-index: 1;
          border-radius: 12px;
        }

        @media (max-width: 1024px) {
          .hero {
            background-position: 75% center;
          }

          .box {
            max-width: min(500px, 85%);
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 12px 20px;
          }

          .hamburger {
            display: flex;
          }

          .nav-links {
            position: fixed;
            top: 0;
            right: ${isMenuOpen ? '0' : '-100%'};
            height: 100vh;
            width: 70%;
            max-width: 300px;
            background: rgba(47, 107, 47, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: center;
            gap: 30px;
            transition: right 0.4s ease;
            padding: 40px;
          }

          .nav-links li a, .nav-links li button {
            font-size: 1.1rem;
            padding: 12px 20px;
          }

          .hero {
            background-position: 70% center;
          }
        }

        @media (max-width: 720px) {
          .hero {
            background-image: linear-gradient(180deg, rgba(47, 107, 47, 0.3), rgba(47, 107, 47, 0.5)),
                              url("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800");
            background-position: center;
            padding-top: 90px;
            align-items: center;
            justify-content: flex-start;
          }

          .hero-text {
            text-align: center;
            margin: 30px auto 20px;
          }

          .hero-text p {
            white-space: normal;
            width: 100%;
            border-right: none;
            animation: none;
          }

          .mobile-image {
            display: block;
          }

          .box {
            margin: 20px auto 40px;
            text-align: center;
          }
        }

        @media (max-width: 450px) {
          .hero {
            padding-top: 80px;
          }

          .hero-text {
            margin-top: 20px;
          }

          .hero-text h1 {
            font-size: 2rem;
          }

          .hero-text p {
            font-size: 0.95rem;
          }

          .box {
            padding: 20px;
            font-size: 0.9rem;
            margin-bottom: 30px;
          }

          .nav-links {
            width: 80%;
          }
        }

        @media (max-width: 360px) {
          .logo {
            font-size: 1.1rem;
          }

          .hero-text h1 {
            font-size: 1.8rem;
          }

          .box {
            padding: 16px;
          }
        }

        @media (max-height: 600px) and (orientation: landscape) {
          .hero {
            min-height: auto;
            padding-top: 80px;
            padding-bottom: 40px;
          }

          .hero-text {
            margin-top: 20px;
          }

          .box {
            margin-top: 20px;
            margin-bottom: 30px;
          }
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: #d4ffd4; }
        }

        @keyframes fadeInBox {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">WasteCare</div>
        
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className="nav-links">
          <li><a onClick={closeMenu}>Home</a></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/schedule" onClick={closeMenu}>Schedule</Link></li>
          <li><a onClick={closeMenu}>Resources</a></li>

          {/* Conditional rendering based on user authentication */}
          {!user ? (
            // Show only Login button if user is NOT logged in
            <li><Link to="/auth" className="login-btn" onClick={closeMenu}>Login</Link></li>
          ) : (
            // Show Dashboard and Logout if user IS logged in
            <>
              <li><Link to="/dashboard" className="login-btn" onClick={closeMenu}>Dashboard</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          )}
        </ul>
      </nav>

      {/* HERO SECTION */}
      <main className="hero" role="main" aria-label="Recycling illustration hero">
        {/* Main Hero Title */}
        <div className="hero-text">
          <h1>WasteCare</h1>
          <p>"Clean streets, green minds, better tomorrow."</p>
        </div>

        {/* Hero Text Box */}
        <div className="box">
          <p>
            Every piece of waste tells a story. Our platform ensures that no trash is left behind. From scheduling pickups to online bill payments, residents and businesses are empowered to maintain a cleaner, healthier city. Together, we can turn inefficient waste management into a sustainable, seamless experience.
          </p>
        </div>

        {/* Mobile Image */}
        <img 
          className="mobile-image" 
          src={landing} 
          alt="Recycling illustration"
        />
      </main>
    </>
  );
}