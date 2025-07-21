import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import '../css/Result.css';

function Result() {
  const [resultData, setResultData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

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
    const link = document.createElement('a');
    link.href = resultData.resultImage;
    link.download = `processed-xray-${resultData.fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Image validation and upload logic
  const processNewFile = (file) => {
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
        let colorDiffSum = 0;
        const pixelCount = img.width * img.height;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const avg = (r + g + b) / 3;
          colorDiffSum += Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);
        }

        const meanColorDiff = colorDiffSum / pixelCount;

        if (meanColorDiff > 20) {
          showToast("warning", "Invalid Image", "The uploaded image does not appear to be a periapical X-ray. Please upload a dental X-ray");
          setIsProcessing(false);
          return;
        }

        // Send to backend after validation
        const formData = new FormData();
        formData.append('file', file);

        fetch('/api/uploadfiles/', {
          method: 'POST',
          body: formData,
        })
          .then(async (res) => {
            if (!res.ok) {
              let errorMsg = "Something went wrong. Please try again.";
              try {
                const errorData = await res.json();
                errorMsg = errorData.error || errorMsg;
              } catch (e) {
                // If response is not JSON, keep default errorMsg
              }
              showToast("error", "Upload Failed", errorMsg);
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
              setResultData(newResultData);
              sessionStorage.setItem('cariesResult', JSON.stringify(newResultData));
              setIsProcessing(false);
            };
            origReader.readAsDataURL(file);
          })
          .catch(() => {
            showToast("error", "Model Error", "AI model not loaded or server offline.");
            setIsProcessing(false);
          });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAgain = () => {
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