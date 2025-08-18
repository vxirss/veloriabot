import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { logPunishment } from '../../database.js';

export default {
	data: {
		name: 'unban',
		description: 'Zdejmuje bana z użytkownika po jego ID.',
		options: [
			{
				name: 'userid',
				description: 'ID użytkownika do odbanowania',
				type: 3,
				required: true,
			},
			{
				name: 'reason',
				description: 'Powód odbanowania',
				type: 3,
				required: false,
			},
		],
		default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
	},
	async execute(interaction) {
		const userId = interaction.options.getString('userid');
		const reason = interaction.options.getString('reason') || 'Nie podano powodu';

		let banInfo;
		try {
			banInfo = await interaction.guild.bans.fetch(userId);
		} catch {
			return await interaction.reply({ content: 'Ten użytkownik nie jest zbanowany lub ID jest nieprawidłowe.', flags: 64 });
		}

		try {
			await interaction.guild.members.unban(userId, reason);
		} catch (err) {
			return await interaction.reply({ content: `Nie udało się odbanować użytkownika. ${err}`, flags: 64 });
		}

		const caseNumber = await logPunishment({
			userId,
			guildId: interaction.guild.id,
			type: 'unban',
			reason,
			moderatorId: interaction.user.id,
		});

		const dmEmbed = new EmbedBuilder()
			.setTitle('🚪 Zostałeś odbanowany')
			.addFields(
				{ name: 'Serwer', value: interaction.guild.name, inline: false },
				{ name: 'Moderator', value: `${interaction.user.tag} (${interaction.user.id})`, inline: false },
				{ name: 'Powód', value: reason, inline: false }
			);
		// ...existing code...
	}
};
