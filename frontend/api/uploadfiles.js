export const config = {
  api: {
    bodyParser: false, // ❗ Necessary to forward multipart/form-data correctly
  },
};

export default async function handler(req, res) {
  try {
    // Read raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    // Forward to FastAPI backend
    const response = await fetch("https://open-slug-nearby.ngrok-free.app/uploadfiles/", {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"], // must forward the original content-type
      },
      body: rawBody,
    });

    // Forward the response back to frontend
    const contentType = response.headers.get("content-type") || "";
    res.status(response.status);
    res.setHeader("Content-Type", contentType);
    res.send(await response.text());
  } catch (error) {
    console.error("❌ Proxy error:", error);
    res.status(500).json({ error: "Proxy upload failed" });
  }
}