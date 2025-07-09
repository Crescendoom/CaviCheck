import '../css/Header.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { scrollToSection } from '../components/Smooth-Scroll.js'; 

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      // If on home page, just scroll
      scrollToSection(sectionId);
    }
  };

  return (
    <header>
      <div className="logo-section">
        <img src="./logo.png" alt="logo icon" />
        <h1 className="extra-thick">
          <span className="cavi-text">Cavi</span>
          <span className="check-text">Check</span>
        </h1>
      </div>
      <nav className="nav-section">
        <button onClick={() => handleNavigation('top')} className="nav-link">Home</button>
        <button onClick={() => handleNavigation('about')} className="nav-link">About</button>
        <button onClick={() => handleNavigation('upload')} className="nav-link">Caries Detection</button>
        <button onClick={() => handleNavigation('contact-us')} className="nav-link">Contact Us</button>
      </nav>
    </header>
  )
}

export default Header;