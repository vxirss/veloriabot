import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logPunishment } from '../../database.js';

export default {
	data: {
		name: 'warn',
		description: 'Ostrzeżenie użytkownika',
		options: [
			{
				name: 'user',
				description: 'Użytkownik do ostrzeżenia',
				type: 6,
				required: true,
			},
			{
				name: 'reason',
				description: 'Powód ostrzeżenia',
				type: 3,
				required: false,
			},
		],
		default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
	},
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'Nie podano powodu';

		if (user.id === interaction.client.user.id) {
			return await interaction.reply({
				content: 'Nie możesz ostrzec bota!',
				flags: 64,
			});
		}

		if (user.id === interaction.user.id) {
			return await interaction.reply({
				content: 'Nie możesz ostrzec samego siebie!',
				flags: 64,
			});
		}

		const dmEmbed = new EmbedBuilder()
			.setTitle('⚠️ Otrzymałeś ostrzeżenie')
			.addFields(
				{ name: 'Serwer', value: interaction.guild.name, inline: false },
				{ name: 'Moderator', value: interaction.user.tag, inline: false },
				{ name: 'Powód', value: reason, inline: false }
			);
		// ...existing code...
	}
};
