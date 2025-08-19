import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { setMessagesLogChannel } from '../../database.js';

export default {
  data: {
    name: 'msglog-delete',
    description: 'Usuwa ustawienia kanału logów wiadomości.',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    await setMessagesLogChannel(interaction.guild.id, null);

    const embed = new EmbedBuilder()
      .setTitle('Kanał logów wiadomości usunięty')
      .setDescription('Logi wiadomości nie będą już wysyłane do żadnego kanału.')
      .setColor(0xFF0000);

    await interaction.reply({ embeds: [embed] });
  },
};