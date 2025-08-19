import { handleTicketButton, handleOpenTicketButton } from '../commands/tickets/ticket.js';
import { handleTeamButton } from '../commands/info/team.js';
import { getVerifyRole } from '../database.js';

export default {
  name: 'interactionCreate',
  async execute(interaction) {
    // Obsługa przycisków ticketów, zespołu i weryfikacji
    if (interaction.isButton()) {
      if (interaction.customId === 'open_ticket') {
        if (!interaction.replied && !interaction.deferred) {
          await handleOpenTicketButton(interaction);
        }
        return;
      }
      if (interaction.customId === 'zglos_zespol') {
        if (!interaction.replied && !interaction.deferred) {
          await handleTeamButton(interaction);
        }
        return;
      }
      if (interaction.customId === 'verify_user') {
        const roleId = await getVerifyRole(interaction.guild.id);
        if (roleId) {
          try {
            await interaction.member.roles.add(roleId, 'Weryfikacja przez bota');
            await interaction.reply({ content: 'Zostałeś zweryfikowany!', ephemeral: true });
          } catch (err) {
            await interaction.reply({ content: 'Nie udało się nadać roli. Skontaktuj się z administracją.', ephemeral: true });
          }
        } else {
          await interaction.reply({ content: 'Rola weryfikacyjna nie jest ustawiona.', ephemeral: true });
        }
        return;
      }
      if (!interaction.replied && !interaction.deferred) {
        await handleTicketButton(interaction);
      }
      return;
    }

    // Obsługa komend
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania komendy.', ephemeral: true });
        }
      }
    }
  },
};