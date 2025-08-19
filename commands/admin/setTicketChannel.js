import { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { setTicketCategory } from '../../database.js';

export default {
  data: {
    name: 'set-ticket',
    description: 'Wyślij embed z przyciskiem do ticketów i ustaw kategorię dla ticketów.',
    options: [
      {
        name: 'kanał',
        description: 'Kanał tekstowy do przycisku ticketów.',
        type: 7,
        required: true,
        channel_types: [0], // 0 = GuildText
      },
      {
        name: 'kategoria',
        description: 'Kategoria dla nowych ticketów.',
        type: 7,
        required: true,
        channel_types: [4], // 4 = GuildCategory
      },
      {
        name: 'opis',
        description: 'Opis w embedzie.',
        type: 3,
        required: false,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    // Log diagnostyczny
    console.log('setticketchannel executed');

    const channel = interaction.options.getChannel('kanał');
    const category = interaction.options.getChannel('kategoria');
    const description = interaction.options.getString('opis') || 'Kliknij przycisk poniżej, aby utworzyć ticket i skontaktować się z administracją.';

    if (!channel || channel.type !== 0) {
      return await interaction.reply({
        content: 'Podany kanał nie jest tekstowy!',
        flags: 64,
      });
    }
    if (!category || category.type !== 4) {
      return await interaction.reply({
        content: 'Podany kanał nie jest kategorią!',
        flags: 64,
      });
    }

    // Ustaw kategorię dla ticketów w bazie
    await setTicketCategory(interaction.guild.id, category.id);

    const embed = new EmbedBuilder()
      .setTitle('📩 Utwórz ticket')
      .setDescription(description)
      .setColor(0x00cfff);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('Otwórz ticket')
        .setStyle(ButtonStyle.Primary)
    );

    // Wyślij tylko jedną wiadomość na kanał
    await channel.send({ embeds: [embed], components: [row] });

    // Odpowiedz tylko raz do interakcji
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: `Wysłano embed z przyciskiem do ticketów w kanale <#${channel.id}>.\nTickety będą tworzone w kategorii: **${category.name}**.`,
        flags: 64,
      });
    }
  },
};