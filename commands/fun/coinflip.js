export default {
	data: {
		name: 'coinflip',
		description: 'Rzut monetą: orzeł czy reszka?',
	},
	async execute(interaction) {
		const result = Math.random() < 0.5 ? 'Orzeł 🦅' : 'Reszka 🪙';
		const embed = {
			title: 'Rzut monetą',
			description: `Wynik: **${result}**`,
			color: 0x6f00ff
		};
		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};
