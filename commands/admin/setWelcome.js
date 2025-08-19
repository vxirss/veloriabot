import { PermissionFlagsBits } from 'discord.js';
import { setWelcomeChannel, setWelcomeMessage, setWelcomeEnabled, getWelcomeChannel, getWelcomeMessage, getWelcomeEnabled } from '../../database.js';

export default {
  data: {
    name: 'setwelcome',
    description: 'Ustawia kanał i treść powitania nowych użytkowników.',
    options: [
      {
        name: 'kanał',
        description: 'Kanał tekstowy do powitań.',
        type: 7, // CHANNEL
        required: true,
        channel_types: [0], // 0 = GuildText
      },
      {
        name: 'wiadomość',
        description: 'Treść powitania. Możesz użyć {user} jako miejsce na wzmiankę.',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'włącz',
        description: 'Czy włączyć powitania? (true/false)',
        type: 5, // BOOLEAN
        required: false,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanał');
    const message = interaction.options.getString('wiadomość');
    const enabled = interaction.options.getBoolean('włącz');

    if (!channel || channel.type !== 0) {
      return await interaction.reply({
        content: 'Podany kanał nie jest tekstowy!',
        flags: 64,
      });
    }

    await setWelcomeChannel(interaction.guild.id, channel.id);
    await setWelcomeMessage(interaction.guild.id, message);
    if (enabled !== null) {
      await setWelcomeEnabled(interaction.guild.id, enabled);
    }

    await interaction.reply({
      content: `Kanał powitań ustawiony na <#${channel.id}>.\nTreść powitania: "${message}"\nFunkcja powitań: ${enabled !== null ? (enabled ? 'włączona' : 'wyłączona') : 'bez zmian'}`,
      flags: 64,
    });
  },
};