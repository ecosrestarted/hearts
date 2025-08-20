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
        title: '📩 New Minibike Message',
        description: `You have a **new message** from your website contact form.\n\nCheck out their Instagram too: [@YOUR_INSTAGRAM](https://www.instagram.com/YOUR_INSTAGRAM)`,
        color: 0x1abc9c,
        fields: [
          { name: '\u200B', value: '\u200B' }, // spacing
          { name: '👤 Name', value: name, inline: false },
          { name: '\u200B', value: '\u200B' },
          { name: '📧 Email', value: `[${email}](mailto:${email})`, inline: false },
          { name: '\u200B', value: '\u200B' },
          { name: '💬 Message', value: message, inline: false },
          { name: '\u200B', value: '\u200B' }
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
      throw new Error(`Discord webhook error: ${discordRes.statusText}`);
    }

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

