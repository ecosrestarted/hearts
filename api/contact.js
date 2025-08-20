import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });

  const BOT_TOKEN = process.env.DISCORD_TOKEN;
  const CHANNEL_ID = process.env.CHANNEL_ID;

  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

  try {
    await client.login(BOT_TOKEN);

    const channel = await client.channels.fetch(CHANNEL_ID);
    const embed = new EmbedBuilder()
      .setTitle("📩 New Contact Form Submission")
      .addFields(
        { name: "Name", value: name },
        { name: "Email", value: email },
        { name: "Message", value: message }
      )
      .setColor("Green")
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  } finally {
    client.destroy();
  }
}
