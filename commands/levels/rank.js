import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { User } from '../../database.js';

export default {
	data: {
		name: 'rank',
		description: 'Pokazuje tabelę rankingową użytkowników według poziomu i XP.',
		default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
	},
	async execute(interaction) {
		const guildId = interaction.guild.id;
		// Pobierz top 10 użytkowników z tego serwera, posortowanych po poziomie i XP
		const topUsers = await User.find({ guildId })
			.sort({ level: -1, xp: -1 })
			.limit(10);

		if (!topUsers.length) {
			return await interaction.reply({
				content: 'Brak użytkowników w rankingu na tym serwerze.',
				flags: 64,
			});
		}

		let desc = '';
		for (let i = 0; i < topUsers.length; i++) {
			const user = topUsers[i];
			const member = await interaction.guild.members.fetch(user.id).catch(() => null);
			const name = member ? member.user.tag : `ID: ${user.id}`;
			desc += `**${i + 1}.** <@${user.id}> — Poziom: **${user.level || 1}**, XP: **${user.xp || 0}**\n`;
		}

		const embed = new EmbedBuilder()
			.setTitle('🏆 Ranking poziomów')
			.setColor(0x9b59b6)
			.setDescription(desc)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
