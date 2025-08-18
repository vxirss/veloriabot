import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Wyświetla losowego psa'),
  async execute(interaction) {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await res.json();
      const imageUrl = data.message;
      if (!imageUrl) throw new Error('Brak obrazka');
      await interaction.reply({
        embeds: [{
          title: '🐶 Losowy pies',
          image: { url: imageUrl },
          color: 0x0099ff
        }],
        ephemeral: false
      });
    } catch (err) {
      await interaction.reply('Nie udało się pobrać psa. Spróbuj ponownie później.');
    }
  }
};
