import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ content: `Nieuwe bezoeker op MiniMechanics! Tijd: ${new Date()}` })
    });

    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );
    res.setHeader("Content-Type", "image/gif");
    res.status(200).end(pixel);

  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
