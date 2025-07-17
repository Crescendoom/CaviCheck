import io
import base64
import torch
import numpy as np
import cv2
import os
import requests
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import segmentation_models_pytorch as smp
from PIL import Image

def is_likely_xray(img_rgb):
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    diff = np.abs(img_rgb[:,:,0] - gray) + np.abs(img_rgb[:,:,1] - gray) + np.abs(img_rgb[:,:,2] - gray)
    mean_diff = np.mean(diff)
    print("Mean grayscale diff:", mean_diff)
    return mean_diff < 10

def download_model():
    """Download model from Google Drive if not exists"""
    model_dir = Path("model")
    model_dir.mkdir(exist_ok=True)
    model_path = model_dir / "Trial.pth"
    
    if not model_path.exists():
        print("📥 Downloading AI model...")
        # Replace with your Google Drive direct download link
        model_url = "https://drive.google.com/uc?export=download&id=1WPh9y9-_MCnfnxsCxfBXVkmCKsYm8UIJ"
        
        response = requests.get(model_url, stream=True)
        response.raise_for_status()
        
        with open(model_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("✅ Model downloaded!")
    
    return str(model_path)

# === Load Model ===
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🔧 Using device: {device}")

model = smp.Unet(
    encoder_name="resnet50",
    encoder_weights=None,
    in_channels=3,
    classes=1,
    activation=None
).to(device)

# Download and load model
try:
    model_path = download_model()
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    raise e

# === FastAPI App ===
app = FastAPI(title="CaviCheck API", description="AI-powered dental caries detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CaviCheck API is running! 🦷", "status": "healthy"}

@app.post("/uploadfiles/")
async def upload_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (640, 640))
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        if not is_likely_xray(img_rgb):
            return JSONResponse(
                status_code=400, 
                content={"error": "Uploaded image does not appear to be a dental X-ray."}
            )

        input_img = img_rgb.astype(np.float32) / 255.0
        input_tensor = torch.tensor(input_img).permute(2, 0, 1).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            mask = torch.sigmoid(output).squeeze().cpu().numpy()
            mask_bin = (mask > 0.5).astype(np.uint8) * 255

        caries_detected = np.sum(mask_bin) > 0
        status = "Caries Detected!" if caries_detected else "No Caries Detected!"

        # Create visualization
        overlay = img_rgb.copy()
        overlay[mask_bin > 0] = [255, 0, 0]
        final = cv2.addWeighted(img_rgb, 0.7, overlay, 0.3, 0)
        
        fig = Figure(figsize=(8, 8))
        canvas = FigureCanvas(fig)
        ax = fig.add_subplot(111)
        ax.imshow(final)
        ax.axis('off')
        ax.set_title(status, fontsize=16, fontweight='bold')
        canvas.draw()

        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode()

        return JSONResponse({
            "image": img_base64,
            "status": status,
            "hasDetection": int(caries_detected)
        })

    except Exception as e:
        print("🔥 ERROR:", e)
        return JSONResponse(
            status_code=500, 
            content={"error": "Failed to process image."}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)