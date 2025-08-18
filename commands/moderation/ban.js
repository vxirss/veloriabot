import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logPunishment, getModerationLogChannel } from '../../database.js';

export default {
	data: {
		name: 'ban',
		description: 'Banuje użytkownika',
		options: [
			{
				name: 'user',
				description: 'Użytkownik do zbanowania',
				type: 6,
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
		const reason = interaction.options.getString('reason') || 'Nie podano powodu';
		const member = interaction.guild.members.cache.get(user.id);

		if (!member || !member.bannable) {
			return await interaction.reply({ content: 'Nie można zbanować tego użytkownika.', flags: 64 });
		}

		const dmEmbed = new EmbedBuilder()
			.setTitle('🔨 Zostałeś zbanowany')
			.addFields(
				{ name: 'Serwer', value: interaction.guild.name, inline: false },
				{ name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: 'Powód', value: reason, inline: false }
			)
			.setColor(0xCC0000)
			.setTimestamp();

		try {
			await user.send({ embeds: [dmEmbed] });
		} catch {}

		await member.ban({ reason });
		// ...existing code...
	}
};
