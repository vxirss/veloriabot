import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Punishment } from '../../database.js';

export default {
  data: {
    name: 'clearhistory',
    description: 'Usuwa wszystkie kary dla użytkownika',
    options: [
      {
        name: 'user',
        description: 'Użytkownik, którego historia zostanie usunięta',
        type: 6, // USER
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;

    const result = await Punishment.deleteMany({ userId: user.id, guildId });

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Historia Usunięta')
      .setDescription(`Wszystkie kary dla ${user.tag} zostały usunięte.`)
      .setColor(0xFF0000)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};