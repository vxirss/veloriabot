import { EmbedBuilder } from 'discord.js';

export default {
	data: {
		name: 'info',
		description: 'Pokazuje informacje o serwerze.',
	},
	async execute(interaction) {
		const guild = interaction.guild;
		const owner = await guild.fetchOwner();

		const embed = new EmbedBuilder()
			.setTitle(`📊 Server Info: ${guild.name}`)
			.setColor(0x5865F2)
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: 'ID serwera', value: guild.id, inline: true },
				{ name: 'Właściciel', value: `${owner.user.tag} (${owner.user.id})`, inline: true },
				{ name: 'Członkowie', value: `${guild.memberCount}`, inline: true },
				{ name: 'Kanały', value: `${guild.channels.cache.size}`, inline: true },
				{ name: 'Role', value: `${guild.roles.cache.size}`, inline: true },
				{ name: 'Utworzono', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true }
			)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
