import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Shippuje dwóch użytkowników')
    .addUserOption(option =>
      option.setName('user1')
        .setDescription('Pierwszy użytkownik')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user2')
        .setDescription('Drugi użytkownik')
        .setRequired(true)),
  async execute(interaction) {
    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2');
    const percent = Math.floor(Math.random() * 101);
    let result = '';
    if (percent > 80) result = '💖 Idealna para!';
    else if (percent > 50) result = '💞 Całkiem nieźle!';
    else if (percent > 30) result = '💛 Może coś z tego będzie...';
    else result = '💔 Raczej przyjaźń.';
    await interaction.reply({
      embeds: [{
        title: '🚢 Ship',
        description: `${user1} + ${user2} = **${percent}%**\n${result}`,
        color: 0xff66cc
      }],
      ephemeral: false
    });
  }
};
