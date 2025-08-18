import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import ms from 'ms';
import { logPunishment, getModerationLogChannel } from '../../database.js';

export default {
	data: {
		name: 'tempban',
		description: 'Banuje użytkownika na określony czas.',
		options: [
			{
				name: 'user',
				description: 'Użytkownik do zbanowania',
				type: 6,
				required: true,
			},
			{
				name: 'duration',
				description: 'Czas bana (np. 10m, 2h, 1d)',
				type: 3,
				required: true,
			},
			{
				name: 'reason',
				description: 'Powód zbanowania',
				type: 3,
				required: false,
			},
		],
		default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
	},
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const durationStr = interaction.options.getString('duration');
		const reason = interaction.options.getString('reason') || 'Nie podano powodu';
		const member = interaction.guild.members.cache.get(user.id);

		if (!member || !member.bannable) {
			return await interaction.reply({ content: 'Nie można zbanować tego użytkownika.', flags: 64 });
		}

		const durationMs = ms(durationStr);
		if (!durationMs || durationMs < 1000) {
			return await interaction.reply({ content: 'Nieprawidłowy czas. Użyj formatów takich jak 10m, 2h, 1d.', flags: 64 });
		}

		const dmEmbed = new EmbedBuilder()
			.setTitle('🔨 Zostałeś tymczasowo zbanowany')
			.addFields(
				{ name: 'Serwer', value: interaction.guild.name, inline: false },
				{ name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: 'Powód', value: reason, inline: false }
			);
		// ...existing code...
	}
};
