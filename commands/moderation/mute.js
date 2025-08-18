import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import ms from 'ms';
import { logPunishment, getModerationLogChannel } from '../../database.js';

export default {
	data: {
		name: 'mute',
		description: 'Wycisza użytkownika na określony czas.',
		options: [
			{
				name: 'user',
				description: 'Użytkownik do wyciszenia',
				type: 6,
				required: true,
			},
			{
				name: 'duration',
				description: 'Czas wyciszenia (np. 10m, 2h, 1d)',
				type: 3,
				required: true,
			},
			{
				name: 'reason',
				description: 'Powód wyciszenia',
				type: 3,
				required: false,
			},
		],
		default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
	},
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const durationStr = interaction.options.getString('duration');
		const reason = interaction.options.getString('reason') || 'Nie podano powodu';

		let member;
		try {
			member = await interaction.guild.members.fetch(user.id);
		} catch {
			return await interaction.reply({ content: 'Użytkownik nie znaleziony na tym serwerze.', flags: 64 });
		}

		const durationMs = ms(durationStr);
		if (!durationMs || durationMs < 1000) {
			return await interaction.reply({ content: 'Nieprawidłowy czas. Użyj formatów takich jak 10m, 2h, 1d.', flags: 64 });
		}

		try {
			await member.timeout(durationMs, reason);
		} catch (err) {
			// ...existing code...
		}
		// ...existing code...
	}
};
