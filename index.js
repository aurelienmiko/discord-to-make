import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ALLOWED_BOT_IDS = [
  "1448705422499516519", // ID du bot VintedSeekers
];

client.once("ready", () => {
  console.log(`Bot connecté : ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Ignore les messages de TON bot (évite boucles)
  if (client.user && message.author.id === client.user.id) return;

  // Autorise uniquement certains bots (et tous les humains)
  if (message.author.bot && !ALLOWED_BOT_IDS.includes(message.author.id)) return;

  // Convertit les embeds (Discord.js) en JSON propre
  const embeds = (message.embeds || []).map((e) => e.toJSON());

  // Récupère les pièces jointes (images, etc.)
  const attachments = [...message.attachments.values()].map((a) => ({
    id: a.id,
    url: a.url,
    name: a.name,
    contentType: a.contentType,
    size: a.size,
    width: a.width,
    height: a.height,
  }));

  const payload = {
    server: {
      id: message.guild?.id || null,
      name: message.guild?.name || null,
    },
    channel: {
      id: message.channel?.id || null,
      name: message.channel?.name || null,
    },
    author: {
      id: message.author?.id || null,
      username: message.author?.username || null,
      tag: message.author?.tag || null,
      bot: !!message.author?.bot,
    },
    message: {
      id: message.id,
      content: message.content || "",
      embeds,
      attachments,
      createdTimestamp: message.createdTimestamp,
    },
  };

  // Petit log utile pour debug (tu peux enlever après)
  console.log(
    `MSG ${payload.channel.name} | content=${payload.message.content.length} | embeds=${payload.message.embeds.length} | att=${payload.message.attachments.length}`
  );

  try {
    await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Erreur envoi Make:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
