import { PermissionFlagsBits } from 'discord.js';

const SUPPORT_GUILD_ID = '1406260035465515108';
const ROLE_ID = '1406689621999620237';

export default {
  data: {
    name: 'claim-role',
    description: 'Pozwala właścicielowi serwera odebrać rolę "Korzystam z Velorii" na serwerze wsparcia.',
    default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
  },
  async execute(interaction) {
    const guildOwnerId = interaction.guild.ownerId;
    if (interaction.user.id !== guildOwnerId) {
      return await interaction.reply({
        content: 'Tylko właściciel serwera może odebrać tę rolę.',
        ephemeral: true,
      });
    }

    const supportGuild = interaction.client.guilds.cache.get(SUPPORT_GUILD_ID);
    if (!supportGuild) {
      return await interaction.reply({
        content: 'Nie udało się znaleźć serwera wsparcia.',
        ephemeral: true,
      });
    }

    let member;
    try {
      member = await supportGuild.members.fetch(interaction.user.id);
    } catch {
      return await interaction.reply({
        content: 'Musisz być członkiem serwera wsparcia, aby odebrać rolę.',
        ephemeral: true,
      });
    }

    if (member.roles.cache.has(ROLE_ID)) {
      return await interaction.reply({
        content: 'Już posiadasz rolę "Korzystam z Velorii" na serwerze wsparcia!',
        ephemeral: true,
      });
    }

    try {
      await member.roles.add(ROLE_ID, 'Odebrano rolę Korzystam z Velorii przez /claim-role');
      await interaction.reply({
        content: 'Odebrałeś rolę "Korzystam z Velorii" na serwerze wsparcia!',
        ephemeral: true,
      });
    } catch (err) {
      await interaction.reply({
        content: 'Nie udało się nadać roli. Skontaktuj się z administracją.',
        ephemeral: true,
      });
    }
  },
};