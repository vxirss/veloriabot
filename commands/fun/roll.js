	import { SlashCommandBuilder } from 'discord.js';

	export default {
		data: new SlashCommandBuilder()
			.setName('roll')
			.setDescription('Rzuca kostką (1-6)'),
		async execute(interaction) {
			const result = Math.floor(Math.random() * 6) + 1;
			await interaction.reply({
				embeds: [{
					title: '🎲 Rzut kostką',
					description: `Wynik: **${result}**`,
					color: 0x00ff00
				}],
				ephemeral: false
			});
		}
	};
