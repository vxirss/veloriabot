import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { setModerationLogChannel } from '../../database.js';

export default {
  data: {
    name: 'modlog-delete',
    description: 'Usuwa ustawienia kanału logów moderacji.',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    await setModerationLogChannel(interaction.guild.id, null);

    const embed = new EmbedBuilder()
      .setTitle('Kanał logów moderacji usunięty')
      .setDescription('Logi moderacji nie będą już wysyłane do żadnego kanału.')
      .setColor(0xFF0000);

    await interaction.reply({ embeds: [embed] });
  },
};