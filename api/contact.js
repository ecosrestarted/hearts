import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const webhookURL = process.env.DISCORD_WEBHOOK;

  const payload = {
    embeds: [
      {
        title: '📨 New Contact Form Submission',
        description: `You have a new message from your website contact form!`,
        color: 0xf1c40f, // Bright yellow/gold for strong visibility
        fields: [
          { name: '👤 Name', value: name, inline: false },
          { name: '📧 Email', value: `[${email}](mailto:${email})`, inline: false },
          { name: '💬 Message', value: message, inline: false }
        ],
        footer: { text: 'Website Contact Form' },
        timestamp: new Date().toISOString(),
        url: `mailto:${email}`, // clicking title opens email client
        thumbnail: { url: 'https://i.imgur.com/rdm3W9t.png' },
        image: { url: 'https://i.imgur.com/3ZQ3ZzZ.png' } // optional banner image
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
      throw new Error(`Discord webhook error: ${discordRes.statusText}`);
    }

    res.status(200).json({ message: '✅ Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Failed to send message' });
  }
}
