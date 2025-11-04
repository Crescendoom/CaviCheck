import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import '../css/Result.css';

function Result() {
  const [resultData, setResultData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('unet');
  const [pendingFile, setPendingFile] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Get result data from sessionStorage
    const storedResult = sessionStorage.getItem('cariesResult');
    if (storedResult) {
      const data = JSON.parse(storedResult);
      setResultData(data);
      // Set the model that was used for this result as default
      if (data.modelUsed) {
        setSelectedModel(data.modelUsed);
      }
    } else {
      // If no result data, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleDownload = () => {
    if (!resultData) return;
    
    // Determine model name for filename
    const modelName = resultData.modelUsed === 'unet' ? 'ResNet50-UNet' : 'ConvNext-Mask2Former';
    
    const link = document.createElement('a');
    link.href = resultData.resultImage;
    link.download = `${modelName}-processed-${resultData.fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Image validation and upload logic
  const processNewFile = (file, modelToUse) => {
    setIsProcessing(true);
    setShowModelSelector(false);

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
        formData.append('model', modelToUse); // Send selected model

        fetch('/api/uploadfiles/', {
          method: 'POST',
          body: formData,
        })
          .then(async (res) => {
            if (!res.ok) {
              if (res.status === 503) {
                showToast("error", "Model Unavailable", "The selected model is not available on the server.");
                setIsProcessing(false);
                return;
              }

              let errorMsg = "Something went wrong. Please try again.";
              try {
                const errorData = await res.json();
                errorMsg = errorData.error || errorMsg;
              } catch (e) {}
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
                hasDetection: result.hasDetection,
                modelUsed: modelToUse // Store which model was used
              };
              setResultData(newResultData);
              sessionStorage.setItem('cariesResult', JSON.stringify(newResultData));
              setIsProcessing(false);
              
              // Show success toast with model name
              const modelName = modelToUse === 'unet' ? 'ResNet-50 and U-Net' : 'ConvNext-Tiny and Mask2Former';
              showToast("info", "Analysis Complete", `Processed with ${modelName}`);
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
      setPendingFile(file);
      setShowModelSelector(true);
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleConfirmUpload = () => {
    if (pendingFile) {
      processNewFile(pendingFile, selectedModel);
      setPendingFile(null);
    }
  };

  const handleCancelUpload = () => {
    setShowModelSelector(false);
    setPendingFile(null);
    document.getElementById('result-file-input').value = '';
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
      {/* Model Selector Modal */}
      {showModelSelector && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Select AI Model</h2>
            <p className="modal-description">Choose which model to use for analysis</p>
            
            <div className="model-selector">
              <div 
                className="category-slider"
                style={{
                  transform: selectedModel === 'unet' ? 'translateX(0%)' : 'translateX(100%)'
                }}
              />
              <button 
                className={`category-btn ${selectedModel === 'unet' ? 'active' : ''}`}
                onClick={() => handleModelSelect('unet')}
              >
                ResNet-50 and U-Net
              </button>
              <button 
                className={`category-btn ${selectedModel === 'mask2former' ? 'active' : ''}`}
                onClick={() => handleModelSelect('mask2former')}
              >
                ConvNext-Tiny and Mask2Former
              </button>
            </div>

            <div className="modal-actions">
              <button onClick={handleCancelUpload} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleConfirmUpload} className="confirm-btn">
                Process Image
              </button>
            </div>
          </div>
        </div>
      )}

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