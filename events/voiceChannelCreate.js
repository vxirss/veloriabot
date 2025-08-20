import { ChannelType, PermissionsBitField } from 'discord.js';
import { getCreateChannels } from '../database.js';

export default {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // User joins or moves to a create channel
    if (
      newState.channel &&
      (!oldState.channel || oldState.channel.id !== newState.channel.id)
    ) {
      try {
        const createChannels = await getCreateChannels(newState.guild.id);
        const channelEntry = createChannels.find(c => String(c.channelId) === String(newState.channel.id));
        if (channelEntry) {
          let name = channelEntry.nameTemplate || '{username}';
          name = name
            .replace('{username}', newState.member.user.username)
            .replace('{id}', newState.member.user.id)
            .replace('{nickname}', newState.member.nickname || newState.member.user.username);

          const guild = newState.guild;
          const member = newState.member;
          // Upewnij się, że parent istnieje i jest typu kategoria
          let parent = null;
          if (newState.channel.parent && newState.channel.parent.type === ChannelType.GuildCategory) {
            parent = newState.channel.parent;
          }
          const privateChannel = await guild.channels.create({
            name: `🔒 ${name}`,
            type: ChannelType.GuildVoice,
            parent: parent ?? undefined,
            permissionOverwrites: [
              { id: guild.id, deny: [PermissionsBitField.Flags.Connect] },
              { id: member.id, allow: [
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.ManageChannels,
                PermissionsBitField.Flags.MuteMembers,
                PermissionsBitField.Flags.DeafenMembers,
                PermissionsBitField.Flags.MoveMembers
              ] },
            ],
          });
          // NIE dodawaj prywatnego kanału do bazy jako kanału do tworzenia!
          await member.voice.setChannel(privateChannel);
        }
      } catch (err) {
        console.error('Błąd przy tworzeniu prywatnego kanału:', err);
      }
    }

    // User leaves or moves from a voice channel
    if (
      oldState.channel &&
      (!newState.channel || oldState.channel.id !== newState.channel.id)
    ) {
      try {
        const channel = oldState.channel;
        const { getCreateChannels } = await import('../database.js');
        const createChannels = await getCreateChannels(channel.guild.id);
        const isStartChannel = createChannels.some(c => String(c.channelId) === String(channel.id));
        // Usuwaj tylko kanały, które NIE są kanałami startowymi
        if (
          channel &&
          channel.members.size === 0 &&
          channel.type === ChannelType.GuildVoice &&
          !isStartChannel
        ) {
          await channel.delete('Kanał jest pusty.');
        }
      } catch (err) {
        console.error('Błąd przy usuwaniu prywatnego kanału:', err);
      }
    }
  },
};