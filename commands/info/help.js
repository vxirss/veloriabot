import { EmbedBuilder } from 'discord.js';
import path from 'path';

export default {
  data: {
    name: 'help',
    description: 'Wyświetla listę komend podzielonych na kategorie (foldery)',
  },
  async execute(interaction) {
    const commands = interaction.client.commands;
    const allCommands = Array.from(commands.values());
    // Wyciągnij komendę config
    const configCmd = allCommands.find(cmd => cmd.data.name === 'config');
    // Grupowanie komend według folderu (kategorii)
    const categories = {};
    allCommands.forEach(cmd => {
      // Pomijaj config, dodamy ją osobno
      if (cmd.data.name === 'config') return;
      let category = 'Inne';
      if (cmd.__filename) {
        const parts = cmd.__filename.split(path.sep);
        const idx = parts.findIndex(p => p === 'commands');
        if (idx !== -1 && parts[idx + 1]) category = parts[idx + 1];
      }
      if (!categories[category]) categories[category] = [];
      categories[category].push(cmd);
    });

    const embeds = [];
    // Dodaj config na górze
    if (configCmd) {
      embeds.push(new EmbedBuilder()
        .setTitle('Konfiguracja serwera')
        .setColor(0x6E6565)
        .setDescription(`• \`/${configCmd.data.name}\` — ${configCmd.data.description}`)
        .setTimestamp());
    }
    for (const [category, cmds] of Object.entries(categories)) {
      let desc = '';
      cmds.forEach(cmd => {
        desc += `• \`/${cmd.data.name}\` — ${cmd.data.description}\n`;
      });
      embeds.push(new EmbedBuilder()
        .setTitle(`Komendy: ${category}`)
        .setColor(0x6E6565)
        .setDescription(desc)
        .setTimestamp());
    }

    if (embeds.length === 0) {
      await interaction.reply({ content: 'Brak komend do wyświetlenia.' });
      return;
    }
    await interaction.reply({ embeds: [embeds[0]] });
    for (let i = 1; i < embeds.length; i++) {
      await interaction.followUp({ embeds: [embeds[i]] });
    }
  },
};