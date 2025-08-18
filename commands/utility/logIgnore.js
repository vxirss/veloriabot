import { PermissionFlagsBits } from 'discord.js';
import { setLogIgnoreChannel } from '../../database.js';

export default {
  data: {
    name: 'log-ignore',
    description: 'Dodaje kanał do listy ignorowanych przez system logów wiadomości.',
    options: [
      {
        name: 'kanał',
        description: 'Kanał, który ma być ignorowany przez logi.',
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

    await setLogIgnoreChannel(interaction.guild.id, channel.id);

    await interaction.reply({
      content: `Kanał <#${channel.id}> został dodany do listy ignorowanych przez logi wiadomości.`,
      ephemeral: true,
    });
  },
};