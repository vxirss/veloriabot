import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildCreate',
  async execute(guild) {
    const channel =
      guild.systemChannel ||
      guild.channels.cache.find(
        ch => ch.isTextBased() && (ch.name.includes('general') || ch.name.includes('ogólny'))
      );

    const embed = new EmbedBuilder()
      .setTitle('👋 Dziękuję za dodanie mnie na serwer!')
      .setDescription('Użyj komendy `/help`, aby zobaczyć moje komendy.')
      .addFields(
        { name: 'Liczba serwerów, na których jestem', value: `${guild.client.guilds.cache.size}`, inline: true }
      )
      .setColor(0x5865F2)
      .setTimestamp();

    if (channel) {
      await channel.send({ embeds: [embed] });
    }
  },
};