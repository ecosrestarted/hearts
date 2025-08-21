export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Haal IP van de bezoeker (Vercel proxy)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const { userAgent, url, screenWidth, screenHeight, time } = req.body;

  const webhookURL = process.env.WEBHOOK_URL; // Discord webhook in .env

  const payload = {
    content: `📌 Nieuwe bezoeker:
- IP: ${ip}
- Browser/OS: ${userAgent}
- Pagina: ${url}
- Resolutie: ${screenWidth}x${screenHeight}
- Tijd: ${time}`
  };

  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Webhook verzenden mislukt');

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
