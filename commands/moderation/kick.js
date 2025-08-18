import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logPunishment, getModerationLogChannel } from '../../database.js';

export default {
	data: {
		name: 'kick',
		description: 'Wyrzuca użytkownika z serwera i rejestruje tę akcję.',
		options: [
			{
				name: 'user',
				description: 'Użytkownik do wyrzucenia',
				type: 6,
				required: true,
			},
			{
				name: 'reason',
				description: 'Powód wyrzucenia',
				type: 3,
				required: false,
			},
		],
		default_member_permissions: PermissionFlagsBits.KickMembers.toString(),
	},
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'Nie podano powodu';
		const member = interaction.guild.members.cache.get(user.id);

		if (!member || !member.kickable) {
			return await interaction.reply({ content: 'Nie można wyrzucić tego użytkownika.', flags: 64 });
		}

		const dmEmbed = new EmbedBuilder()
			.setTitle('👢 Zostałeś wyrzucony z serwera')
			.addFields(
				{ name: 'Serwer', value: interaction.guild.name, inline: false },
				{ name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: 'Powód', value: reason, inline: false }
			)
			.setColor(0xFF9900)
			.setTimestamp();

		try {
			await user.send({ embeds: [dmEmbed] });
		} catch {}

		await member.kick(reason);
		// ...existing code...
	}
};
