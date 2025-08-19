import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { setModerationLogChannel } from '../../database.js';

export default {
  data: {
    name: 'modlog-set',
    description: 'Ustawia kanał logów moderacji.',
    options: [
      {
        name: 'channel',
        description: 'Kanał do wysyłania logów moderacji',
        type: 7, // CHANNEL
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!channel || !channel.isTextBased()) {
      return await interaction.reply({ content: 'Proszę wybrać prawidłowy kanał tekstowy.', flags: 64 });
    }

    await setModerationLogChannel(interaction.guild.id, channel.id);

    const embed = new EmbedBuilder()
      .setTitle('Kanał Logów Moderacji Ustawiony')
      .setDescription(`Logi moderacji będą teraz wysyłane do <#${channel.id}>.`)
      .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
  },
};