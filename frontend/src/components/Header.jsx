import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Only do section detection on the main page (home route)
      if (location.pathname === '/') {
        const sections = ['home', 'about', 'upload', 'contact-us'];
        const scrollPosition = window.scrollY + 120;
        
        let currentSection = 'home';
        
        for (let i = 0; i < sections.length; i++) {
          const section = document.getElementById(sections[i]);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
              currentSection = sections[i];
              break;
            }
          }
        }
        
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]); // Add location.pathname as dependency

  // Set active section based on current route
  useEffect(() => {
    if (location.pathname === '/') {
      // On home page, keep scroll-based detection
      setActiveSection('home');
    } else if (location.pathname === '/result') {
      // On result page, set upload as active (since that's where they came from)
      setActiveSection('upload');
    } else {
      // For other routes, try to match with pathname
      const pathToSection = {
        '/': 'home',
        '/about': 'about',
        '/upload': 'upload',
        '/contact': 'contact-us',
        '/contact-us': 'contact-us'
      };
      
      setActiveSection(pathToSection[location.pathname] || 'home');
    }
  }, [location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Updated scroll function to handle both routes and sections
  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      window.location.href = '/#' + sectionId;
      return;
    }

    // If we're on the home page, scroll to section
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = 80;
      let targetPosition;
      
      if (sectionId === 'home') {
        targetPosition = 0;
      } else {
        targetPosition = section.offsetTop - headerHeight + 5;
      }
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
      closeMenu();
    } else {
      console.warn(`Section with id "${sectionId}" not found`);
    }
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'upload', label: 'Caries Detection' },
    { id: 'contact-us', label: 'Contact Us' }
  ];

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="logo-section">
          <img src="/logo.png" alt="CaviCheck Logo" />
          <h1>
            <span className="cavi-text extra-thick">Cavi</span>
            <span className="check-text">Check</span>
          </h1>
        </div>

        <nav className={`nav-section ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Menu Overlay */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />
    </>
  );
};

export default Header;