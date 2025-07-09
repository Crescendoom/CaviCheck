import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Result.css';

function Result() {
  const [resultData, setResultData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get result data from sessionStorage
    const storedResult = sessionStorage.getItem('cariesResult');
    
    if (storedResult) {
      setResultData(JSON.parse(storedResult));
    } else {
      // If no result data, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleDownload = () => {
    if (!resultData) return;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = resultData.originalImage;
    link.download = `processed-xray-${resultData.fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadAgain = () => {
    // Clear the result data and navigate back to home
    sessionStorage.removeItem('cariesResult');
    navigate('/');
    // Scroll to upload section after navigation
    setTimeout(() => {
      const element = document.getElementById('upload');
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  if (!resultData) {
    return (
      <div className="caries-result">
        <div className="loading-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="caries-result">
      <div className="result-container">
        <div className="result-content">
          {/* Left side - Clean X-ray image without any overlays */}
          <div className="image-section">
            <div className="image-container">
              <img 
                src={resultData.originalImage} 
                alt="Processed X-ray image" 
                className="xray-image"
              />
              {/* No detection overlays - removed completely */}
            </div>
          </div>

          {/* Right side - Results and actions */}
          <div className="details-section">
            <div className="result-header">
              <h1 className="result-title">Analysis Complete!</h1>
            </div>

            <div className="result-description">
              <p>{resultData.analysisText}</p>
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleDownload}
                className="download-btn"
              >
                Download
              </button>
              <button 
                onClick={handleUploadAgain}
                className="upload-again-btn"
              >
                Upload Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;