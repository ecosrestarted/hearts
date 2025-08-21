export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { userAgent, url, screenWidth, screenHeight, time } = req.body;
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "Onbekend";

    const message = `<@929694354610716712> 📌 Nieuwe bezoeker:\n` +
      `**IP:** ${ip}\n` +
      `**Browser/OS:** ${userAgent}\n` +
      `**Pagina:** ${url}\n` +
      `**Resolutie:** ${screenWidth}x${screenHeight}\n` +
      `**Tijd:** ${time}`;

    await fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook mislukt" });
  }
}
