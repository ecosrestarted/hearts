import fetch from "node-fetch";

export default async function handler(req, res) {
  const webhookURL = "https://discord.com/api/webhooks/1407776162565849229/UQ4yqawY9xR11hHsfGjyQKqTDLjewgN840f-G31QnYXk8zg8VMfAOUCn8i9GzDMzdA_d"; // zet hier je echte webhook
  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `⚡ Iemand heeft je site geopend!` }),
    });

    res.status(200).json({ message: "Webhook verzonden!" });
  } catch (err) {
    res.status(500).json({ error: "Kon webhook niet verzenden", details: err });
  }
}
