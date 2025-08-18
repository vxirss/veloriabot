import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { getCreateChannels } from '../../database.js';

export default {
  data: {
    name: 'privatechannels',
    description: 'Lista wszystkich prywatnych kanałów głosowych dla tego serwera.',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channels = await getCreateChannels(interaction.guild.id);

    if (!channels.length) {
      return await interaction.reply({
        content: 'Nie skonfigurowano prywatnych kanałów głosowych dla tego serwera.',
        flags: 64
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('Skonfigurowane prywatne kanały głosowe')
      .setColor(0x5865F2)
      .setDescription(
        channels.map((c, i) =>
          `**${i + 1}.** <#${c.channelId}> — Template: \`${c.nameTemplate}\``
        ).join('\n')
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};