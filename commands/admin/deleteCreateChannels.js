import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { CreateChannel } from '../../database.js';

export default {
  data: {
    name: 'clearpvc',
    description: 'Usuwa z bazy danych wszystkie prywatne kanały głosowe.',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    await CreateChannel.deleteMany({ guildId: interaction.guild.id });

    const embed = new EmbedBuilder()
      .setTitle('Prywatne kanały usunięte')
      .setDescription('Wszystkie prywatne kanały głosowe zostały usunięte z bazy danych dla tego serwera.')
      .setColor(0xFF0000);

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};