import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { getPunishments } from '../../database.js';

export default {
  data: {
    name: 'history',
    description: 'Pokazuje historie kar dla użytkownika',
    options: [
      {
        name: 'user',
        description: 'Użytkownik, którego historia ma być wyświetlona',
        type: 6, // USER
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
  },
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;

    const punishments = await getPunishments(user.id, guildId);

    if (!punishments.length) {
      return await interaction.reply({
        content: `Nie znaleziono historii kar dla ${user.tag}.`,
        flags: 64,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`Historia kar dla ${user.tag}`)
      .setColor(0x5865F2)
      .setDescription(
        punishments
          .map(p =>
            `**Case #${p.caseNumber}**\nTyp: ${p.type}\nModerator: <@${p.moderatorId}>\nPowód: ${p.reason}\nData: <t:${Math.floor(new Date(p.timestamp).getTime() / 1000)}:f>`
          )
          .join('\n\n')
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};