import { PermissionFlagsBits } from 'discord.js';
import { setTicketLogChannel, getTicketLogChannel } from '../../database.js';

export default {
  data: {
    name: 'set-ticketlog',
    description: 'Ustawia kanał logów dla ticketów.',
    options: [
      {
        name: 'kanał',
        description: 'Kanał tekstowy, w którym będą logowane tickety.',
        type: 7, // CHANNEL
        required: true,
        channel_types: [0], // 0 = GuildText
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanał');
    if (!channel || channel.type !== 0) {
      return await interaction.reply({
        content: 'Podany kanał nie jest tekstowy!',
        flags: 64,
      });
    }

    await setTicketLogChannel(interaction.guild.id, channel.id);

    await interaction.reply({
      content: `Kanał logów ticketów został ustawiony na <#${channel.id}>.`,
      flags: 64,
    });
  },
};