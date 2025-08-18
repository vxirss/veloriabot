import { ChannelType, PermissionsBitField } from 'discord.js';
import { getCreateChannels } from '../database.js';

export default {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {

    // User joins or moves to a create channel
    if (
      newState.channel &&
      (
        !oldState.channel ||
        oldState.channel.id !== newState.channel.id
      )
    ) {
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

        try {
          const privateChannel = await guild.channels.create({
            name: `🔒 ${name}`,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parent ?? null,
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

          await member.voice.setChannel(privateChannel);
        } catch (err) {
        }
      }
    }

    // User leaves or moves from a voice channel
    if (
      oldState.channel &&
      (
        !newState.channel ||
        oldState.channel.id !== newState.channel.id
      )
    ) {
      const channel = oldState.channel;
      if (
        channel &&
        channel.members.size === 0 &&
        channel.type === ChannelType.GuildVoice &&
        channel.name.startsWith('🔒')
      ) {
        try {
          await channel.delete('Kanał jest pusty.');
          
        } catch (err) {
          
        }
      }
    }
  },
};