import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Upload.css'

function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreview = e.target.result;
      
      // Brief processing animation then redirect
      setTimeout(() => {
        // Create result data with same image - NO detection areas
        const resultData = {
          originalImage: imagePreview,
          resultImage: imagePreview, // Same image as uploaded
          fileName: file.name,
          hasDetection: false, // No detection overlays
          detectionAreas: [], // Empty array - no red overlays
          analysisText: "Analysis complete. Your dental X-ray has been successfully processed and is ready for review. Please consult with a dental professional for comprehensive diagnosis and treatment planning."
        };

        // Store result data in sessionStorage
        sessionStorage.setItem('cariesResult', JSON.stringify(resultData));

        // Navigate to result page
        navigate('/result');
      }, 1500); // 1.5 second delay
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setIsProcessing(false);
  };

  return (
    <div className="caries-detection">
      <div className="upload-container">
        <h1 className="upload-title">Upload Your Periapical X-ray</h1>
        
        {isProcessing ? (
          // Processing state
          <div className="processing-container">
            <div className="processing-animation">
              <div className="spinner"></div>
            </div>
            <h3 className="processing-title">Processing Your X-ray...</h3>
            <p className="processing-text">Our AI Model is analyzing your periapical X-ray for caries detection.</p>
          </div>
        ) : (
          // Upload state
          <div 
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

        {/* Only show remove button if not processing */}
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