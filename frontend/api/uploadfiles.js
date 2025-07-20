export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Forward the request to your backend
  const response = await fetch('https://open-slug-nearby.ngrok-free.app/uploadfiles/', {
    method: 'POST',
    headers: {
      ...req.headers,
      'ngrok-skip-browser-warning': 'true'
    },
    body: req.body
  });

  const data = await response.json();
  res.status(response.status).json(data);
}