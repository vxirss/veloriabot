import dotenv from 'dotenv';
dotenv.config();
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: {
    name: 'shutdown',
    description: 'Wyłącza bota (Tylko dla właściciela)',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({ content: 'Nie masz uprawnień do użycia tej komendy.', flags: 64 });
    }

    const embed = new EmbedBuilder()
      .setTitle('Wyłączanie Bota')
      .setDescription('Bot zostanie wyłączony...')
      .setColor(0xff0000);

    await interaction.reply({ embeds: [embed] });

    // Wyłącz bot
    process.exit(0);
  },
};