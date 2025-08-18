import { SlashCommandBuilder }  from 'discord.js'

const answers = [
	'Tak.',
	'Nie.',
	'Może.',
	'Zdecydowanie tak!',
	'Zdecydowanie nie!',
	'Spróbuj ponownie.',
	'Nie mogę teraz odpowiedzieć.',
	'Wygląda dobrze!',
	'Wygląda źle!'
];

export default {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Odpowiada na pytanie tak/nie')
		.addStringOption(option =>
			option.setName('pytanie')
				.setDescription('Twoje pytanie')
				.setRequired(true)),
	async execute(interaction) {
		const question = interaction.options.getString('pytanie');
		const answer = answers[Math.floor(Math.random() * answers.length)];
		await interaction.reply({
			embeds: [{
				title: '🎱 Magiczna kula',
				description: `Pytanie: **${question}**\nOdpowiedź: **${answer}**`,
				color: 0x0099ff
			}],
			ephemeral: false
		});
	}
};
