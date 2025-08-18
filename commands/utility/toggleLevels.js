import { PermissionFlagsBits } from 'discord.js';
import { setLevelsEnabled, getLevelsEnabled } from '../../database.js';

export default {
  data: {
    name: 'levels',
    description: 'Włącza lub wyłącza system poziomów na serwerze.',
    options: [
      {
        name: 'status',
        description: 'Włącz (on) lub wyłącz (off) poziomy',
        type: 3, // STRING
        required: true,
        choices: [
          { name: 'on', value: 'on' },
          { name: 'off', value: 'off' },
        ],
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const status = interaction.options.getString('status');
    await setLevelsEnabled(interaction.guild.id, status === 'on');
    await interaction.reply({
      content: `System poziomów został ${status === 'on' ? 'włączony' : 'wyłączony'}!`,
      flags: 64,
    });
  },
};