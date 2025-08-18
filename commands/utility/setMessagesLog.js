import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { setMessagesLogChannel } from '../../database.js';

export default {
  data: {
    name: 'msglog-set',
    description: 'Ustawia kanał logów wiadomości.',
    options: [
      {
        name: 'channel',
        description: 'Kanał do wysyłania logów wiadomości',
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

    await setMessagesLogChannel(interaction.guild.id, channel.id);

    const embed = new EmbedBuilder()
      .setTitle('Kanał Logów Wiadomości Ustawiony')
      .setDescription(`Logi wiadomości będą teraz wysyłane do <#${channel.id}>.`)
      .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
  },
};