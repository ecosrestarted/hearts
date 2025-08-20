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
    return res.status(500).json({ error: 'Webhook URL not set' });
  }

  const payload = {
    embeds: [
      {
        title: '📩 New Contact Form Submission',
        description: `You have a **new message** from your website contact form.\n\nPlease check the details below:`,
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

    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
