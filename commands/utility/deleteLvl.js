import { PermissionFlagsBits } from 'discord.js';
import { User } from '../../database.js';

export default {
  data: {
    name: 'resetxp',
    description: 'Resetuje XP i poziom wybranego użytkownika.',
    options: [
      {
        name: 'user',
        description: 'Użytkownik do zresetowania',
        type: 6, // USER
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const target = interaction.options.getUser('user');
    await User.updateOne(
      { id: target.id, guildId },
      { $set: { xp: 0, level: 1 } }
    );
    await interaction.reply({
      content: `XP i poziom użytkownika <@${target.id}> zostały zresetowane.`,
      flags: 64,
    });
  },
};