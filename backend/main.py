# --- Imports ---
import torch
import numpy as np
import cv2
import base64
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
from pyngrok import ngrok
import nest_asyncio
import uvicorn
import segmentation_models_pytorch as smp
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

# --- Load Model ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = smp.Unet(
    encoder_name="resnet50",
    encoder_weights=None,
    in_channels=3,
    classes=1,
    activation=None
).to(device)
model.load_state_dict(torch.load("model/Caries.pth", map_location=device))
model.eval()

# --- FastAPI App ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cavi-check.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/uploadfiles/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        image_bytes = await file.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Save original dimensions
        original_h, original_w = img.shape[:2]

        # Resize for model input
        img_resized = cv2.resize(img, (640, 640))
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)

        # Normalize and convert to tensor
        input_img = img_rgb.astype(np.float32) / 255.0
        input_tensor = torch.tensor(input_img).permute(2, 0, 1).unsqueeze(0).to(device)

        # Run model
        with torch.no_grad():
            output = model(input_tensor)
            mask = torch.sigmoid(output).squeeze().cpu().numpy()
            mask_bin = (mask > 0.5).astype(np.uint8) * 255

        # Resize mask back to original size
        mask_resized = cv2.resize(mask_bin, (original_w, original_h), interpolation=cv2.INTER_NEAREST)

        # Detect caries
        caries_detected = np.sum(mask_resized) > 0
        status = "Caries Detected!" if caries_detected else "No Caries Detected!"

        # Overlay mask on original image
        color_mask = np.zeros_like(img)
        color_mask[:, :, 2] = mask_resized
        overlay = cv2.addWeighted(img, 0.7, color_mask, 0.3, 0)

        # Convert overlay to base64 PNG
        fig = Figure()
        canvas = FigureCanvas(fig)
        ax = fig.add_subplot(111)
        ax.imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
        ax.axis('off')
        canvas.draw()

        buf = io.BytesIO()
        fig.savefig(buf, format='png')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode()

        return JSONResponse({
            "image": img_base64,
            "status": status,
            "hasDetection": int(caries_detected)
        })

    except Exception as e:
        print("🔥 ERROR:", e)
        return JSONResponse(status_code=500, content={"error": "Failed to process image."})


@app.get("/")
async def home():
    return HTMLResponse("""
    <html>
      <head><title>CaviCheck – Caries Detection</title></head>
      <body style="text-align:center;">
        <h2>Upload Your Dental X-ray</h2>
        <form action="/uploadfiles/" enctype="multipart/form-data" method="post">
          <input name="file" type="file">
          <input type="submit">
        </form>
      </body>
    </html>
    """)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)