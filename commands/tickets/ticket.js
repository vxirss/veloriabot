import { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Ticket, getTicketCategory, getTicketLogChannel } from '../../database.js';

const ticketCommand = {
  data: {
    name: 'ticket',
    description: 'Tworzy prywatny kanał pomocy (ticket).',
    options: [
      {
        name: 'powód',
        description: 'Powód utworzenia ticketa',
        type: 3,
        required: false,
      },
    ],
    default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
  },
  async execute(interaction) {
    const reason = interaction.options?.getString?.('powód') || 'Brak powodu';
    const guild = interaction.guild;
    const user = interaction.user;

    // Sprawdź, czy użytkownik nie ma już otwartego ticketa
    const existing = guild.channels.cache.find(
      ch =>
        ch.type === ChannelType.GuildText &&
        ch.name === `ticket-${user.id}`
    );
    if (existing) {
      if (!interaction.replied && !interaction.deferred) {
        return await interaction.reply({
          content: `Masz już otwarty ticket: <#${existing.id}>`,
          flags: 64,
        });
      }
      return;
    }

    // Pobierz numer sprawy dla ticketa
    const caseNumber = (await Ticket.countDocuments({ guildId: guild.id })) + 1;
    await Ticket.create({
      guildId: guild.id,
      userId: user.id,
      caseNumber,
      reason,
      createdAt: new Date(),
      channelId: null,
      closed: false,
    });

    // Pobierz kategorię dla ticketów (jeśli ustawiona)
    const parentId = await getTicketCategory(guild.id);

    // Tworzenie kanału ticketa
    const ticketChannel = await guild.channels.create({
      name: `ticket-${caseNumber}`, // <-- zmiana: używaj caseNumber
      type: ChannelType.GuildText,
      topic: `Ticket #${caseNumber} użytkownika ${user.tag} (${user.id})`,
      parent: parentId || undefined,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
      ],
    });

    // Zaktualizuj channelId w bazie
    await Ticket.findOneAndUpdate(
      { guildId: guild.id, caseNumber },
      { channelId: ticketChannel.id }
    );

    const embed = new EmbedBuilder()
      .setTitle(`🎫 Ticket utworzony (#${caseNumber})`)
      .setDescription(`Witaj <@${user.id}>!\nOpisz swój problem, a moderatorzy pomogą Ci najszybciej jak to możliwe.\n\n**Powód:** ${reason}`)
      .addFields({ name: 'Case', value: `#${caseNumber}`, inline: true })
      .setColor(0x00cfff)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Zamknij ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({ content: `<@${user.id}>`, embeds: [embed], components: [row] });

    // Logowanie ticketa do kanału logów (jeśli ustawiony)
    const logChannelId = await getTicketLogChannel(guild.id);
    if (logChannelId) {
      const logChannel = guild.channels.cache.get(logChannelId);
      if (logChannel && logChannel.isTextBased()) {
        const logEmbed = new EmbedBuilder()
          .setTitle('📋 Ticket utworzony')
          .addFields(
            { name: 'Użytkownik', value: `<@${user.id}>`, inline: true },
            { name: 'Case', value: `#${caseNumber}`, inline: true },
            { name: 'Powód', value: reason }
          )
          .setColor(0x00cfff)
          .setTimestamp();
        await logChannel.send({ embeds: [logEmbed] });
      }
    }

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: `Twój ticket (#${caseNumber}) został utworzony: <#${ticketChannel.id}>`,
        flags: 64,
      });
    }
  },
};

export default ticketCommand;

export async function handleTicketButton(interaction) {
  if (!interaction.isButton() || interaction.customId !== 'close_ticket') return;

  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
    if (!interaction.replied && !interaction.deferred) {
      return await interaction.reply({ content: 'Tylko moderator może zamknąć ticket.', ephemeral: true });
    }
    return;
  }

  // Pobierz case number ticketa z bazy
  const ticket = await Ticket.findOne({ channelId: interaction.channel.id, guildId: interaction.guild.id });
  const caseNumber = ticket ? ticket.caseNumber : 'Brak';

  // Pobierz ostatnie 100 wiadomości z kanału ticketa
  const messages = await interaction.channel.messages.fetch({ limit: 100 });
  const sorted = Array.from(messages.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
  let transcript = sorted.map(msg => `[${new Date(msg.createdTimestamp).toLocaleString()}] ${msg.author.tag}: ${msg.content}`).join('\n');
  if (transcript.length > 1900) transcript = transcript.slice(0, 1900) + '\n... (obcięto)';

  // Zapisz zamknięcie ticketa i transcript w bazie
  await Ticket.findOneAndUpdate(
    { channelId: interaction.channel.id, guildId: interaction.guild.id },
    {
      closed: true,
      closedAt: new Date(),
      closedBy: interaction.user.id,
      transcript
    }
  );

  // Logowanie zamknięcia ticketa i zawartości kanału
  const logChannelId = await getTicketLogChannel(interaction.guild.id);
  if (logChannelId) {
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    if (logChannel && logChannel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setTitle('🔒 Ticket zamknięty')
        .addFields(
          { name: 'Case', value: `#${caseNumber}`, inline: true },
          { name: 'Kanał', value: `${interaction.channel.name}`, inline: true },
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setDescription('Zawartość ticketa:\n```' + (transcript || 'Brak wiadomości') + '```')
        .setColor(0xff0000)
        .setTimestamp();
      await logChannel.send({ embeds: [embed] });
    }
  }

  await interaction.channel.delete('Ticket zamknięty przez moderatora.');
}

export async function handleOpenTicketButton(interaction) {
  if (!interaction.replied && !interaction.deferred) {
    await ticketCommand.execute(interaction);
  }
}