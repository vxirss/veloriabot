import { REST, Routes } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    client.user.setActivity('/help', { type: 0 }); // type: 0 = Playing

    // Register slash commands globally
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const commandsData = Array.from(client.commands.values()).map(cmd => cmd.data);

    try {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commandsData }
      );
      console.log('Successfully registered application commands globally.');
    } catch (error) {
      console.error('Error registering commands:', error);
    }

    console.log(`✅ Logged in as ${client.user.tag} | Servers: ${client.guilds.cache.size}`);
  },
};