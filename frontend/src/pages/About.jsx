import '../css/About.css';

function About() {
  return (
    <div className="main-about">
      <div className="main-about-content">
        <div className="main-section">
          <h1 className="main-title">
            <span className="black-text">CaviCheck is a </span>
            <span className="highlight">clinical decision support system</span>
            <span className="black-text"> built for individual dentists, clinics, and educational institutions.</span>
          </h1>
        </div>
        
        <div className="about-section">
          <div className="content-card">
            <div className="content-icon">
              <img src="./about-image-1.png" alt="Dentist Chair Icon" />
            </div>
            <p className="content-description">
              CaviCheck helps dentists detect caries quickly and accurately from X-ray images, reducing errors and streamlining diagnoses through visual overlays.
            </p>
          </div>
          
          <div className="content-card">
            <div className="content-icon">
              <img src="./about-image-2.png" alt="Dental Care Icon" />
            </div>
            <p className="content-description">
              Clinics can standardize diagnostics, improve efficiency, and support faster decisions with CaviCheck's automated caries detection and easy-to-use web interface.            </p>
          </div>

          <div className="content-card">
            <div className="content-icon">
              <img src="./about-image-3.png" alt="Student Icon" />
            </div>
            <p className="content-description">
              CaviCheck enhances student learning by visually guiding caries identification and bridging textbook knowledge with real-world diagnostics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;