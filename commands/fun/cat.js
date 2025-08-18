import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Wyświetla losowego kota'),
  async execute(interaction) {
    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await res.json();
      const imageUrl = data[0]?.url;
      if (!imageUrl) throw new Error('Brak obrazka');
      await interaction.reply({
        embeds: [{
          title: '😺 Losowy kot',
          image: { url: imageUrl },
          color: 0xff9900
        }],
        ephemeral: false
      });
    } catch (err) {
      await interaction.reply('Nie udało się pobrać kota. Spróbuj ponownie później.');
    }
  }
};
