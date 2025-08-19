import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { addCreateChannel } from '../../database.js';

export default {
  data: {
    name: 'setcreatechannel',
    description: 'Ustawia kanał, który wyzwala tworzenie prywatnych kanałów głosowych.',
    options: [
      {
        name: 'channel',
        description: 'Kanał głosowy, który ma być użyty jako wyzwalacz',
        type: 7, // CHANNEL
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!channel || channel.type !== 2) {
      return await interaction.reply({ content: 'Wybierz prawidłowy kanał głosowy.', flags: 64 });
    }
    await addCreateChannel(interaction.guild.id, channel.id);

    const embed = new EmbedBuilder()
      .setTitle('Kanał dodany')
      .setDescription(`Prywatne kanały głosowe będą tworzone, gdy użytkownicy dołączą do <#${channel.id}>.`)
      .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};