import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { Punishment } from '../../database.js';

export default {
  data: {
    name: 'caseinfo',
    description: 'Sprawdza szczegóły kary po numerze case.',
    options: [
      {
        name: 'numer',
        description: 'Numer case do sprawdzenia',
        type: 4,
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
  },
  async execute(interaction) {
    const caseNumber = interaction.options.getInteger('numer');
    const guildId = interaction.guild.id;

    const punishment = await Punishment.findOne({ guildId, caseNumber });
    if (!punishment) {
      return await interaction.reply({
        content: `Nie znaleziono kary o numerze case #${caseNumber}.`,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`🔎 Informacje o karze #${caseNumber}`)
      .addFields(
        { name: 'Użytkownik', value: `<@${punishment.userId}>`, inline: true },
        { name: 'Typ kary', value: punishment.type, inline: true },
        { name: 'Moderator', value: `<@${punishment.moderatorId}>`, inline: true },
        { name: 'Powód', value: punishment.reason || 'Brak powodu', inline: false },
        { name: 'Data', value: `<t:${Math.floor(new Date(punishment.timestamp).getTime() / 1000)}:F>`, inline: false }
      )
      .setColor(0xff0000)
      .setFooter({ text: `Case #${caseNumber}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};