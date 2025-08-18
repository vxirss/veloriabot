import { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { setIdeasChannel, getIdeasChannel } from '../../database.js';

export default {
  data: {
    name: 'set-ideas',
    description: 'Ustawia kanał na propozycje. Bot zamienia wiadomości w embedy i dodaje reakcje.',
    options: [
      {
        name: 'kanał',
        description: 'Kanał tekstowy na propozycje.',
        type: 7, // CHANNEL
        required: true,
        channel_types: [0], // GuildText
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanał');
    if (!channel || channel.type !== 0) {
      return await interaction.reply({ content: 'Podany kanał nie jest tekstowy!', ephemeral: true });
    }

    await setIdeasChannel(interaction.guild.id, channel.id);

    await interaction.reply({
      content: `Kanał propozycji ustawiony na <#${channel.id}>.`,
      ephemeral: true,
    });
  },
};