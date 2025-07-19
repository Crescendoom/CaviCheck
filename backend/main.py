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
        image_bytes = await file.read()
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (640, 640))
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        input_img = img_rgb.astype(np.float32) / 255.0
        input_tensor = torch.tensor(input_img).permute(2, 0, 1).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            mask = torch.sigmoid(output).squeeze().cpu().numpy()
            mask_bin = (mask > 0.5).astype(np.uint8) * 255

        caries_detected = np.sum(mask_bin) > 0
        status = "Caries Detected!" if caries_detected else "No Caries Detected!"

        color_mask = np.zeros_like(img_rgb)
        color_mask[:, :, 0] = mask_bin
        overlay = cv2.addWeighted(img_rgb, 0.7, color_mask, 0.3, 0)

        fig = Figure()
        canvas = FigureCanvas(fig)
        ax = fig.add_subplot(111)
        ax.imshow(overlay)
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
    import os
    import sys

    nest_asyncio.apply()

    # If you want to use ngrok tunnel:
    if "--ngrok" in sys.argv:
        from pyngrok import ngrok
        auth_token = "2zaToPY7BDTMGyLvUaqgD6MEZnn_4eWNjAU2S4J1Y8LgXqjoB"
        ngrok.set_auth_token(auth_token)
        public_url = ngrok.connect(8000)
        print(f"🚀 Public URL: {public_url}")

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)