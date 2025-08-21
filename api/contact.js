export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const webhookURL = process.env.DISCORD_WEBHOOK;
  if (!webhookURL) {
    return res.status(500).json({ error: 'Webhook not set' });
  }

  const payload = {
    embeds: [
      {
        title: '📩 New Contact Form Submission',
        color: 0x1abc9c,
        fields: [
          { name: '👤 Name', value: name },
          { name: '📧 Email', value: email },
          { name: '💬 Message', value: message }
        ],
        footer: { text: 'Website Contact Form' },
        timestamp: new Date(),
      },
    ],
  };

  try {
    const discordRes = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!discordRes.ok) throw new Error('Discord error');

    res.status(200).json({ message: 'Sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}
