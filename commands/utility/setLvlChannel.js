import { PermissionFlagsBits } from 'discord.js';
import { setLevelChannel } from '../../database.js';

export default {
  data: {
    name: 'level-channel',
    description: 'Ustawia kanał, gdzie bot będzie ogłaszał nowe poziomy.',
    options: [
      {
        name: 'channel',
        description: 'Kanał tekstowy do ogłoszeń o poziomach',
        type: 7, // CHANNEL
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!channel || !channel.isTextBased()) {
      return await interaction.reply({
        content: 'Wybierz poprawny kanał tekstowy.',
        flags: 64,
      });
    }
    await setLevelChannel(interaction.guild.id, channel.id);
    await interaction.reply({
      content: `Kanał <#${channel.id}> został ustawiony do ogłoszeń o nowych poziomach.`,
      flags: 64,
    });
  },
};