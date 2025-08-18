import { PermissionFlagsBits } from 'discord.js';

export default {
  data: {
    name: 'purge',
    description: 'Usuwa od 2 do 100 ostatnich wiadomości na kanale.',
    options: [
      {
        name: 'liczba',
        description: 'Ile wiadomości usunąć (od 2 do 100)',
        type: 4, // INTEGER
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.ManageMessages.toString(),
  },
  async execute(interaction) {
    const amount = interaction.options.getInteger('liczba');
    const channel = interaction.channel;

    // Sprawdź uprawnienia
    if (!channel.permissionsFor(interaction.member).has(PermissionFlagsBits.ManageMessages)) {
      return await interaction.reply({ content: 'Nie masz uprawnień do usuwania wiadomości!', ephemeral: true });
    }

    // Sprawdź zakres
    if (!amount || amount < 2 || amount > 100) {
      return await interaction.reply({ content: 'Podaj liczbę od 2 do 100.', ephemeral: true });
    }

    // Pobierz i usuń wiadomości
    const messages = await channel.messages.fetch({ limit: amount });
    const toDelete = messages.filter(msg => !msg.pinned);

    const deleted = await channel.bulkDelete(toDelete, true);

    await interaction.reply({
      content: `Usunięto ${deleted.size} wiadomości.`,
      ephemeral: true,
    });
  },
};