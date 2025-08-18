import { PermissionFlagsBits } from 'discord.js';
import { setUserBirthday, getUserBirthday } from '../../database.js';

export default {
	data: {
		name: 'ustaw-urodziny',
		description: 'Ustaw swoją datę urodzin (DD-MM)',
		options: [
			{
				name: 'data',
				description: 'Data urodzin w formacie DD-MM',
				type: 3,
				required: true,
			},
		],
	},
	async execute(interaction) {
		const date = interaction.options.getString('data');
		if (!/^\d{2}-\d{2}$/.test(date)) {
			return await interaction.reply({ content: 'Podaj datę w formacie DD-MM (np. 25-12)', ephemeral: true });
		}
		await setUserBirthday(interaction.user.id, date);
		await interaction.reply({ content: `Ustawiono Twoje urodziny na: ${date}`, ephemeral: true });
	},
};
