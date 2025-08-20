// File: api/contact.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use your Discord Webhook URL as a Vercel environment variable
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: 'New Contact Form Submission',
            fields: [
              { name: 'Name', value: name },
              { name: 'Email', value: email },
              { name: 'Message', value: message }
            ],
            color: 3066993, // green
            timestamp: new Date()
          }
        ]
      })
    });

    res.status(200).json({ message: 'Message sent to Discord!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Export for Vercel serverless function
export default app;
