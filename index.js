import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Bot connecté : ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  const ALLOWED_BOT_IDS = [
  "1448705422499516519" // ID du bot VintedSeekers
];

if (message.author.bot && !ALLOWED_BOT_IDS.includes(message.author.id)) {
  return;
}


  await fetch(process.env.MAKE_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      server: message.guild?.name,
      channel: message.channel.name,
      author: message.author.username,
      content: message.content
    })
  });
});

client.login(process.env.DISCORD_TOKEN);
