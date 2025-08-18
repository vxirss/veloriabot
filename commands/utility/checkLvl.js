import { PermissionFlagsBits } from 'discord.js';
import { User, getLevelsEnabled } from '../../database.js';

export default {
  data: {
    name: 'showlevel',
    description: 'Pokazuje poziom i XP użytkownika.',
    options: [
      {
        name: 'user',
        description: 'Użytkownik (opcjonalnie)',
        type: 6,
        required: false,
      },
    ],
    default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
  },
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const enabled = await getLevelsEnabled(guildId);
    if (!enabled) {
      return await interaction.reply({
        content: 'System poziomów jest wyłączony na tym serwerze.',
        flags: 64,
      });
    }

    const target = interaction.options.getUser('user') || interaction.user;
    let user = await User.findOne({ id: target.id, guildId });
    if (!user) {
      return await interaction.reply({
        content: `<@${target.id}> nie ma jeszcze poziomu na tym serwerze.`,
        flags: 64,
      });
    }
    const nextLevelXp = user.level ? user.level * 100 : 100;
    await interaction.reply({
      content: `<@${target.id}> ma poziom **${user.level || 1}** (${user.xp || 0}/${nextLevelXp} XP).`,
      flags: 64,
    });
  },
};