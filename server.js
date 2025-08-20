require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const app = express();
app.use(express.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const channel = await client.channels.fetch("YOUR_CHANNEL_ID_HERE");
  const embed = new EmbedBuilder()
    .setTitle("📩 New Contact Form Submission")
    .addFields(
      { name: "Name", value: name, inline: true },
      { name: "Email", value: email, inline: true },
      { name: "Message", value: message }
    )
    .setColor("Green")
    .setTimestamp();

  channel.send({ embeds: [embed] });

  res.json({ success: true });
});

client.login(process.env.DISCORD_TOKEN);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
