import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { Ticket } from '../../database.js';

export default {
  data: {
    name: 'ticketinfo',
    description: 'Pokazuje informacje o zamkniętym tickecie na podstawie case number.',
    options: [
      {
        name: 'case',
        description: 'Numer sprawy ticketa',
        type: 4, // INTEGER
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
  },
  async execute(interaction) {
    const caseNumber = interaction.options.getInteger('case');
    const ticket = await Ticket.findOne({ guildId: interaction.guild.id, caseNumber });

    if (!ticket || !ticket.closed) {
      return await interaction.reply({
        content: 'Nie znaleziono zamkniętego ticketa o podanym numerze.',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`🔒 Ticket #${caseNumber}`)
      .addFields(
        { name: 'Użytkownik', value: `<@${ticket.userId}>`, inline: true },
        { name: 'Kanał', value: ticket.channelId ? `<#${ticket.channelId}>` : 'Kanał usunięty', inline: true },
        { name: 'Powód', value: ticket.reason || 'Brak powodu', inline: false },
        { name: 'Utworzony', value: ticket.createdAt ? `<t:${Math.floor(new Date(ticket.createdAt).getTime()/1000)}:f>` : 'Brak', inline: true },
        { name: 'Zamknięty', value: ticket.closedAt ? `<t:${Math.floor(new Date(ticket.closedAt).getTime()/1000)}:f>` : 'Brak', inline: true },
        { name: 'Zamknięty przez', value: ticket.closedBy ? `<@${ticket.closedBy}>` : 'Brak', inline: true }
      )
      .setColor(0xff0000)
      .setTimestamp();

    // Jeśli masz transcript w bazie, dodaj go do embedu
    if (ticket.transcript) {
      embed.setDescription('Zawartość ticketa:\n```' + ticket.transcript.slice(0, 1900) + (ticket.transcript.length > 1900 ? '\n... (obcięto)' : '') + '```');
    }

    await interaction.reply({ embeds: [embed]});
  },
};