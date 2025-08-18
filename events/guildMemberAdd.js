import { EmbedBuilder } from 'discord.js';
import { getWelcomeChannel, getWelcomeMessage, getWelcomeEnabled, getAutoRole } from '../database.js';

export default {
  name: 'guildMemberAdd',
  async execute(member) {
    console.log('guildMemberAdd fired:', member.user.tag);

    // Nadanie auto-roli jeśli ustawiona
    const autoRoleId = await getAutoRole(member.guild.id);
    if (autoRoleId) {
      try {
        await member.roles.add(autoRoleId, 'Auto-rola przy wejściu na serwer');
        console.log(`Auto-rola nadana: ${autoRoleId}`);
      } catch (err) {
        console.error('Nie udało się nadać auto-roli:', err);
      }
    }

    // Powitanie
    const enabled = await getWelcomeEnabled(member.guild.id);
    console.log('Welcome enabled:', enabled);

    if (!enabled) return;

    const channelId = await getWelcomeChannel(member.guild.id);
    const message = await getWelcomeMessage(member.guild.id);

    console.log('Welcome channel:', channelId);
    console.log('Welcome message:', message);

    if (!channelId || !message) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) {
      console.log('Bot nie ma dostępu do kanału lub kanał nie jest tekstowy.');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`👋 Witaj, ${member.user.username}!`)
      .setDescription(message.replace('{user}', `<@${member.id}>`))
      .setColor(0x00cfff)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Dołączył:', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
        { name: 'Utworzył konto:', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'Liczba członków:', value: `${member.guild.memberCount}`, inline: true }
      )
      .setFooter({ text: `Miłego pobytu na ${member.guild.name}!`, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    console.log('Powitanie wysłane!');
  },
};