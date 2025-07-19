import '../css/Header.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { scrollToSection } from '../components/Smooth-Scroll.js'; 
import { useState, useEffect, useCallback } from 'react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debounced resize handler for better performance
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleResize = useCallback(
    debounce(() => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }, 100),
    [isMenuOpen]
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header>
        <div className="logo-section">
          <img src="./logo.png" alt="logo icon" />
          <h1 className="extra-thick">
            <span className="cavi-text">Cavi</span>
            <span className="check-text">Check</span>
          </h1>
        </div>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-section ${isMenuOpen ? 'active' : ''}`}>
          <button onClick={() => handleNavigation('top')} className="nav-link">Home</button>
          <button onClick={() => handleNavigation('about')} className="nav-link">About</button>
          <button onClick={() => handleNavigation('upload')} className="nav-link">Caries Detection</button>
          <button onClick={() => handleNavigation('contact-us')} className="nav-link">Contact Us</button>
        </nav>
      </header>

      {isMenuOpen && (
        <div 
          className="menu-overlay" 
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
      )}
    </>
  )
}

export default Header;