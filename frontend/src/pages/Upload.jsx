import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import '../css/Upload.css';

function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('unet'); // Changed from 'analysis' to 'unet'
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    document.getElementById('file-input').value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processAndRedirect(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processAndRedirect(file);
    }
  };

  const processAndRedirect = (file) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Show toast for model selection
    if (selectedCategory === 'mask2former') {
      showToast("info", "Mask2Former Model", "Processing with ConvNext-Tiny and Mask2Former.");
    } else {
      showToast("info", "U-Net Model", "Processing with ResNet-50 and U-Net.");
    }

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
          setUploadedFile(null);
          return;
        }

        // 🟢 Send to Vite Proxy API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', selectedCategory); // Directly use 'unet' or 'mask2former'

        // POST to the backend dispatch endpoint
        fetch("/api/uploadfiles/", {
          method: "POST",
          body: formData,
        })
          .then(async (res) => {
            if (!res.ok) {
              if (res.status === 503) {
                // Mask2Former not available on server
                showToast("error", "Model Unavailable", "The selected model is not available on the server.");
                setIsProcessing(false);
                setUploadedFile(null);
                return;
              }

              let errorMsg = "Something went wrong. Please try again.";
              try {
                const errorData = await res.json();
                errorMsg = errorData.error || errorMsg;
              } catch (e) {}
              showToast("error", "Upload Failed", errorMsg);
              setIsProcessing(false);
              setUploadedFile(null);
              return;
            }

            const result = await res.json();
            const resultImage = "data:image/png;base64," + result.image;
            const origReader = new FileReader();
            origReader.onloadend = () => {
              const originalImage = origReader.result;
              const resultData = {
                originalImage,
                resultImage,
                fileName: file.name,
                analysisText: result.status || "Analysis complete. Please consult a dental professional for details.",
                hasDetection: result.hasDetection,
                modelUsed: selectedCategory // Changed from 'category' to 'modelUsed'
              };
              sessionStorage.setItem('cariesResult', JSON.stringify(resultData));
              navigate('/result');
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

  return (
    <div className="caries-detection">
      {/* Category Toggle for AI Model Selection */}
      <div className="category-toggle">
        <div 
          className="category-slider"
          style={{
            transform: selectedCategory === 'unet' ? 'translateX(0%)' : 'translateX(100%)'
          }}
        />
        <button 
          className={`category-btn ${selectedCategory === 'unet' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('unet')}
        >
          ResNet-50 and U-Net
        </button>
        <button 
          className={`category-btn ${selectedCategory === 'mask2former' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('mask2former')}
        >
          ConvNext-Tiny and Mask2Former
        </button>
      </div>

      <div className="upload-container">
        <h1 className="upload-title">Upload Your Periapical X-ray</h1>

        {isProcessing ? (
          <div className="processing-container">
            <div className="processing-animation">
              <div className="spinner"></div>
            </div>
            <h3 className="processing-title">
              {selectedCategory === 'unet' ? 'Processing with U-Net Model...' : 'Processing with Mask2Former Model...'}
            </h3>
            <p className="processing-text">
              {selectedCategory === 'unet' 
                ? 'ResNet-50 and U-Net is analyzing your periapical X-ray for caries detection.'
                : 'ConvNext-Tiny and Mask2Former is analyzing your X-ray for caries detection.'
              }
            </p>
          </div>
        ) : (
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10L12 15L17 10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15V3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="upload-text">
              Drag & drop or click to choose files
            </p>

            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {uploadedFile && !isProcessing && (
          <div className="button-container">
            <button
              className="remove-button"
              onClick={removeFile}
            >
              🗑️ Remove selected file
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;