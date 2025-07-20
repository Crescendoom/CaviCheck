export default async function handler(req, res) {
  const response = await fetch('https://open-slug-nearby.ngrok-free.app/uploadfiles/', {
    method: req.method,
    body: req.method !== 'GET' ? req.body : null,
  });

  const contentType = response.headers.get('content-type') || '';
  res.status(response.status);
  res.setHeader('Content-Type', contentType);
  res.send(await response.text());
}