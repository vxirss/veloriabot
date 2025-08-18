import dotenv from 'dotenv';
dotenv.config();
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: {
    name: 'reload',
    description: 'Przeładowywuje bota (Tylko dla właściciela)',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: 'Nie masz uprawnień do użycia tej komendy.', flags: 64 });
    }

    const embed = new EmbedBuilder()
      .setTitle('Przeładowanie Bota')
      .setDescription('Bot jest przeładowywany...')
      .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });

    // Gracefully restart the bot process
    process.exit(0);
  },
};