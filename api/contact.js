import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  const webhookURL = process.env.DISCORD_WEBHOOK;
  if (!webhookURL) {
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const payload = {
    embeds: [
      {
        title: '📩 New Contact Form Submission',
        description: 'You have a new message from your website contact form.',
        color: 0x1abc9c,
        fields: [
          { name: 'Name', value: name, inline: true },
          { name: 'Email', value: `[${email}](mailto:${email})`, inline: true },
          { name: 'Message', value: message }
        ],
        footer: { text: 'Website Contact Form' },
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
      const text = await discordRes.text();
      console.error('Discord webhook error:', text);
      return res.status(500).json({ error: 'Failed to send message to Discord' });
    }

    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error, try again later' });
  }
}
