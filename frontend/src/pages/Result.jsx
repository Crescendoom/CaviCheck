import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Result.css';

function Result() {
  const [resultData, setResultData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    link.href = resultData.resultImage;
    link.download = `processed-xray-${resultData.fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // New function to handle file processing directly in Result page
  const processNewFile = (file) => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);

    fetch('https://open-slug-nearby.ngrok-free.app/uploadfiles/', {
      method: 'POST',
      body: formData,
    })
    .then(async (res) => {
      if (!res.ok) {
        let errorMsg = "Processing failed.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          // If response is not JSON, keep default errorMsg
        }
        alert(errorMsg);
        setIsProcessing(false);
        return;
      }
      const result = await res.json();
      const resultImage = "data:image/png;base64," + result.image;
      const origReader = new FileReader();
      origReader.onloadend = () => {
        const originalImage = origReader.result;
        const newResultData = {
          originalImage,
          resultImage,
          fileName: file.name,
          analysisText: result.status || "Analysis complete. Please consult a dental professional for details.",
          hasDetection: result.hasDetection
        };
        // Update the current result data
        setResultData(newResultData);
        sessionStorage.setItem('cariesResult', JSON.stringify(newResultData));
        setIsProcessing(false);
      };
      origReader.readAsDataURL(file);
    })
    .catch(() => {
      alert("Error: Could not process the image. The backend may not be running or the model is not loaded.");
      setIsProcessing(false);
    });
  };

  const handleUploadAgain = () => {
    // Trigger file input click
    document.getElementById('result-file-input').click();
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processNewFile(file);
    }
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
                src={resultData.resultImage} 
                alt="Processed X-ray image with overlay" 
                className="xray-image"
              />
              {/* No detection overlays - removed completely */}
            </div>
          </div>

          {/* Right side - Results and actions */}
          <div className="details-section">
            <div className="result-header">
              <h1 className="result-title">
                {isProcessing ? 'Processing New X-ray...' : 'Analysis Complete!'}
              </h1>
            </div>

            <div className="result-description">
              <p>{isProcessing ? 'Please wait while we analyze your new X-ray.' : resultData.analysisText}</p>
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleDownload}
                className="download-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Download'}
              </button>
              <button 
                onClick={handleUploadAgain}
                className="upload-again-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Upload Again'}
              </button>
            </div>

            {/* Hidden file input */}
            <input
              id="result-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;