import { EmbedBuilder } from 'discord.js';

export default {
  data: {
    name: 'ping',
    description: 'Pokazuje aktualny ping bota',
  },
  async execute(interaction) {
    const ping = interaction.client.ws.ping;
    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setDescription(`Mój ping to **${ping}ms**.`)
      .setColor(0x5865F2); // Discord blurple

    await interaction.reply({ embeds: [embed] });
  },
};