import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const webhookURL = process.env.DISCORD_WEBHOOK; // Add to Vercel Dashboard

  const payload = {
    embeds: [
      {
        title: 'New Contact Form Submission',
        color: 0x00ff00,
        fields: [
          { name: 'Name', value: name },
          { name: 'Email', value: email },
          { name: 'Message', value: message }
        ],
        timestamp: new Date()
      }
    ]
  };

  try {
    const discordRes = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!discordRes.ok) {
      throw new Error('Failed to send message to Discord');
    }

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
