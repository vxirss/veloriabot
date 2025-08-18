import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { getMutedRole, logPunishment } from '../../database.js';

export default {
	data: {
		name: 'unmute',
		description: 'Usuwa timeout i/lub wyciszenie użytkownika.',
		options: [
			{
				name: 'user',
				description: 'Użytkownik do odciszenia',
				type: 6,
				required: true,
			},
			{
				name: 'reason',
				description: 'Powód odciszenia',
				type: 3,
				required: false,
			},
		],
		default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
	},
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'Nie podano powodu';
		const member = await interaction.guild.members.fetch(user.id).catch(() => null);

		if (!member) {
			return await interaction.reply({ content: 'Użytkownik nie znaleziony na tym serwerze.', flags: 64 });
		}

		let unmuted = false;

		if (member.communicationDisabledUntilTimestamp && member.communicationDisabledUntilTimestamp > Date.now()) {
			try {
				await member.timeout(null, reason);
				unmuted = true;
			} catch {
				return await interaction.reply({ content: 'Nie udało się zdjąć timeoutu. Sprawdź uprawnienia bota.', flags: 64 });
			}
		}

		const mutedRoleId = await getMutedRole(interaction.guild.id);
		if (mutedRoleId) {
			const mutedRole = interaction.guild.roles.cache.get(mutedRoleId);
			if (mutedRole && member.roles.cache.has(mutedRole.id)) {
				try {
					await member.roles.remove(mutedRole, reason);
					unmuted = true;
				} catch {
					return await interaction.reply({ content: 'Nie udało się zdjąć roli wyciszenia. Sprawdź uprawnienia bota.', flags: 64 });
				}
			}
		}

		if (unmuted) {
			await interaction.reply({ content: 'Użytkownik został odciszony.', ephemeral: false });
			await logPunishment({
				userId: user.id,
				guildId: interaction.guild.id,
				type: 'unmute',
				reason,
				moderatorId: interaction.user.id,
			});
		} else {
			await interaction.reply({ content: 'Użytkownik nie był wyciszony.', ephemeral: true });
		}
	}
};
