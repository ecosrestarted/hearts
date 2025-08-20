import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).send('Missing fields');

  try {
    // temporary bot instance for serverless function
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    await client.login(BOT_TOKEN);

    const channel = await client.channels.fetch(CHANNEL_ID);
    const embed = new EmbedBuilder()
      .setTitle('New Contact Form Submission')
      .addFields(
        { name: 'Name', value: name },
        { name: 'Email', value: email },
        { name: 'Message', value: message }
      )
      .setColor('Green')
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await client.destroy(); // disconnect immediately

    res.status(200).json({ success: true, message: 'Message sent to Discord!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
}
