import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

global.client = client;

// Event handler setup
const eventsPath = path.join(process.cwd(), 'events');
for (const file of readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const eventPath = pathToFileURL(path.join(eventsPath, file)).href;
  const event = await import(eventPath);
  const eventData = event.default || {};
  const once = typeof eventData.once === 'boolean' ? eventData.once : false;
  if (eventData.name && typeof eventData.execute === 'function') {
    if (once) {
      client.once(eventData.name, (...args) => eventData.execute(...args));
    } else {
      client.on(eventData.name, (...args) => eventData.execute(...args));
    }
    console.log('Rejestruję event:', eventData.name);
  }
}

// Command handler setup
client.commands = new Collection();
const commandsPath = path.join(process.cwd(), 'commands');

function getAllCommandFiles(dir) {
  let results = [];
  const list = readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getAllCommandFiles(filePath));
    } else if (file.isFile() && file.name.endsWith('.js')) {
      results.push(filePath);
    }
  }
  return results;
}

const commandFiles = getAllCommandFiles(commandsPath);
for (const file of commandFiles) {
  const commandPath = pathToFileURL(file).href;
  const command = await import(commandPath);
  const cmd = command.default;
  if (cmd && cmd.data && cmd.data.name) {
    client.commands.set(cmd.data.name, cmd);
  }
}

// Login to Discord with your bot token
client.login(process.env.TOKEN);