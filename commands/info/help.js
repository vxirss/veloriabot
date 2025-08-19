import { EmbedBuilder } from 'discord.js';
import path from 'path';

export default {
  data: {
    name: 'help',
    description: 'Wyświetla listę komend podzielonych na kategorie (foldery)',
  },
  async execute(interaction) {
    const commands = interaction.client.commands;
    // Spisz wszystkie komendy w jeden ciąg
    const allCommands = Array.from(commands.values());
    const embeds = [];
    let desc = '';
    allCommands.forEach(cmd => {
  const line = `• \`/${cmd.data.name}\` — ${cmd.data.description}\n`;
      if ((desc.length + line.length) > 4096) {
        embeds.push(new EmbedBuilder()
          .setTitle('Komendy Bota Veloria')
          .setColor(0x6E6565)
          .setDescription(desc)
          .setTimestamp());
        desc = line;
      } else {
        desc += line;
      }
    });
    if (desc.length > 0) {
      embeds.push(new EmbedBuilder()
        .setTitle('Komendy Bota Veloria')
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