import { EmbedBuilder } from 'discord.js';
import { getModerationLogChannel } from '../database.js';

export default {
  name: 'punishmentLogged',
  async execute(punishment) {
    // Find the moderation log channel from the database
    const guild = punishment.guild;
    if (!guild) return;

    const logChannelId = await getModerationLogChannel(guild.id);
    if (!logChannelId) return;

    const logChannel = guild.channels.cache.get(logChannelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    // Build embed based on punishment type
    let color = 0x5865F2;
    let title = 'Moderation Action';
    if (punishment.type === 'ban') {
      color = 0xCC0000;
      title = '🔨 Użytkownik Zbanowany';
    } else if (punishment.type === 'kick') {
      color = 0xFF9900;
      title = '👢 Użytkownik Wyrzucony';
    } else if (punishment.type === 'warn') {
      color = 0xFFFF00;
      title = '⚠️ Użytkownik Ostrzeżony';
    } else if (punishment.type === 'mute') {
      color = 0x808080;
      title = '🔇 Użytkownik Wyciszony';
    } else if (punishment.type === 'unmute') {
      color = 0x00FF00;
      title = '🔈 Użytkownik Odciszony';
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .addFields(
        { name: 'Case', value: `#${punishment.caseNumber}`, inline: true },
        { name: 'Użytkownik', value: `<@${punishment.userId}> (${punishment.userId})`, inline: true },
        { name: 'Moderator', value: `<@${punishment.moderatorId}>`, inline: true },
        { name: 'Powód', value: punishment.reason }
      )
      .setColor(color)
      .setTimestamp(punishment.timestamp);

    await logChannel.send({ embeds: [embed] });
  },
};