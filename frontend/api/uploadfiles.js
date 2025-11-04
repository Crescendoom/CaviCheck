export const config = {
  api: { bodyParser: false },
};

const BACKEND = process.env.BACKEND_URL || "https://open-slug-nearby.ngrok-free.app";

export default async function handler(req, res) {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    const response = await fetch(`${BACKEND}/upload/`, { // << Fixed: Added backticks
      method: "POST",
      headers: { "Content-Type": req.headers["content-type"] },
      body: rawBody,
    });

    const contentType = response.headers.get("content-type") || "";
    res.status(response.status);
    res.setHeader("Content-Type", contentType);
    res.send(await response.text());
  } catch (error) {
    console.error("❌ Proxy error:", error);
    res.status(500).json({ error: "Proxy upload failed" });
  }
}