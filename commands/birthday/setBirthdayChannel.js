import { PermissionFlagsBits } from 'discord.js';
import { setBirthdayChannel } from '../../database.js';

export default {
	data: {
		name: 'ustaw-kanal-urodzinowy',
		description: 'Ustaw kanał, gdzie bot będzie składał życzenia urodzinowe',
		options: [
			{
				name: 'kanał',
				description: 'Kanał tekstowy do życzeń',
				type: 7,
				required: true,
			},
		],
		default_member_permissions: PermissionFlagsBits.Administrator.toString(),
	},
	async execute(interaction) {
		const channel = interaction.options.getChannel('kanał');
		if (!channel || channel.type !== 0) {
			return await interaction.reply({ content: 'Wybierz kanał tekstowy!', ephemeral: true });
		}
		await setBirthdayChannel(interaction.guild.id, channel.id);
		await interaction.reply({ content: `Kanał urodzinowy ustawiony na: <#${channel.id}>`, ephemeral: true });
	},
};
