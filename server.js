require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (your portfolio)
app.use(express.static(path.join(__dirname, "public")));

// Contact form endpoint → sends message to Discord webhook
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      embeds: [
        {
          title: "📩 New Portfolio Contact",
          color: 5814783,
          fields: [
            { name: "👤 Name", value: name, inline: true },
            { name: "📧 Email", value: email, inline: true },
            { name: "💬 Message", value: message }
          ],
          timestamp: new Date()
        }
      ]
    });

    res.json({ success: true, message: "Message sent to Discord!" });
  } catch (err) {
    console.error("Error sending to Discord:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Fallback → serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
