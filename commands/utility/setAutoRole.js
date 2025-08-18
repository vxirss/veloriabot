import { PermissionFlagsBits } from 'discord.js';
import { setAutoRole, getAutoRole } from '../../database.js';

export default {
  data: {
    name: 'setautorole',
    description: 'Ustawia rolę, którą bot nadaje nowym użytkownikom po wejściu na serwer.',
    options: [
      {
        name: 'rola',
        description: 'Rola do nadania nowym użytkownikom',
        type: 8, // ROLE
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const role = interaction.options.getRole('rola');
    if (!role) {
      return await interaction.reply({
        content: 'Nie znaleziono podanej roli!',
        ephemeral: true,
      });
    }

    await setAutoRole(interaction.guild.id, role.id);

    await interaction.reply({
      content: `Rola <@&${role.id}> została ustawiona jako auto-rola dla nowych użytkowników.`,
      ephemeral: true,
    });
  },
};