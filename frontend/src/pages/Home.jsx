import '../css/Home.css'
import { scrollToSection } from '../components/Smooth-Scroll.js'; 

function Home() {
    return (
        <div className="home-container">
            <div className="content-section">
                <h1 className="title">Fast and Reliable <span className="highlight"> Caries Detection </span> for Dentists</h1>
                <p className="subtitle">
                    Upload dental X-rays for instant AI-powered analysis that detects caries, segments<br/>
                    affected areas and supports more accurate, efficient clinical decision-making.<br/>
                   
                </p>
            </div>
            <div className="tooth-container">
                <img src="tooth.png" alt="tooth image" className="tooth-image" />
                <button onClick={() => scrollToSection('upload')} className="try-now-btn">Try it now!</button>
            </div>
        </div>
    );
}

export default Home;