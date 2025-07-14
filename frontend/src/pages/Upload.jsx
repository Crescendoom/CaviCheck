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

  const formData = new FormData();
  formData.append('file', file);

fetch('http://localhost:8000/uploadfiles/', {
  method: 'POST',
  body: formData,
})
  .then(async (res) => {
    if (!res.ok) throw new Error('Processing failed');
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
        hasDetection: result.hasDetection
      };
      sessionStorage.setItem('cariesResult', JSON.stringify(resultData));
      navigate('/result');
    };
    origReader.readAsDataURL(file);
  })
  .catch(() => {
    alert("Error: Could not process the image. The backend may not be running or the model is not loaded.");
    setIsProcessing(false);
  });
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