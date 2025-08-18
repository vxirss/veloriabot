import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { addCreateChannel } from '../../database.js';

export default {
  data: {
    name: 'setchanneltemplate',
    description: 'Ustawia szablon nazwy dla konkretnego kanału głosowego.',
    options: [
      {
        name: 'channel',
        description: 'Kanał głosowy, dla którego chcesz ustawić szablon',
        type: 7, // CHANNEL
        required: true,
      },
      {
        name: 'template',
        description: 'Szablon nazwy (użyj {username}, {id}, {nickname})',
        type: 3, // STRING
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const template = interaction.options.getString('template');
    if (!channel || channel.type !== 2) {
      return await interaction.reply({ content: 'Wybierz prawidłowy kanał głosowy.', flags: 64 });
    }
    await addCreateChannel(interaction.guild.id, channel.id, template);

    const embed = new EmbedBuilder()
      .setTitle('Szablon kanału ustawiony')
      .setDescription(`Szablon dla <#${channel.id}> ustawiony na:\n\`${template}\``)
      .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};