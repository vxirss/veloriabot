import { PermissionFlagsBits } from 'discord.js';
import { setAutoModEnabled, setAutoModWords, getAutoModEnabled, getAutoModWords } from '../../database.js';

export default {
  data: {
    name: 'automod',
    description: 'Włącza automoda i ustawia listę słów do usuwania.',
    options: [
      {
        name: 'włącz',
        description: 'Czy włączyć automoda? (true/false)',
        type: 5, // BOOLEAN
        required: false,
      },
      {
        name: 'słowa',
        description: 'Lista słów do usuwania (oddzielone przecinkami)',
        type: 3, // STRING
        required: false,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const enabled = interaction.options.getBoolean('włącz');
    const words = interaction.options.getString('słowa');

    if (enabled !== null) {
      await setAutoModEnabled(interaction.guild.id, enabled);
    }
    if (words) {
      const wordList = words.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      await setAutoModWords(interaction.guild.id, wordList);
    }

    await interaction.reply({
      content: `Automod: ${enabled !== null ? (enabled ? 'włączony' : 'wyłączony') : 'bez zmian'}\nSłowa do usuwania: ${words ? words : 'bez zmian'}`,
      ephemeral: true,
    });
  },
};