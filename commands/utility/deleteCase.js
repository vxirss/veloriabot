import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Punishment } from '../../database.js';

export default {
  data: {
    name: 'deletecase',
    description: 'Usuwa Case danego użytkownika',
    options: [
      {
        name: 'number',
        description: 'Numer Case do usunięcia',
        type: 4, // INTEGER
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const caseNumber = interaction.options.getInteger('number');
    const guildId = interaction.guild.id;

    const caseDoc = await Punishment.findOneAndDelete({ guildId, caseNumber });

    if (!caseDoc) {
      return await interaction.reply({
        content: `Case #${caseNumber} nie został znaleziony.`,
        flags: 64,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Case Usunięty')
      .setDescription(`Case #${caseNumber} został usunięty.`)
      .addFields(
        { name: 'Typ', value: caseDoc.type, inline: true },
        { name: 'Użytkownik', value: `<@${caseDoc.userId}>`, inline: true },
        { name: 'Moderator', value: `<@${caseDoc.moderatorId}>`, inline: true },
        { name: 'Powód', value: caseDoc.reason }
      )
      .setColor(0xFF0000)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};