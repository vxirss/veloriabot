import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';

const OWNER_ID = '1179471266592333929'; // <-- Twój Discord user ID

export default {
  data: {
    name: 'zespół',
    description: 'Wyświetla stanowiska do zespołu i pozwala zgłosić chęć dołączenia.',
    default_member_permissions: PermissionFlagsBits.SendMessages.toString(),
  },
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🚀 Rekrutacja do zespołu Veloria Bot')
      .setDescription(
        `Aktualnie poszukujemy osób na stanowiska:\n\n` +
        `• **Bot Developer**\n` +
        `• **Grafik**\n` +
        `• **Web Developer**\n\n` +
        `Jeśli chcesz dołączyć do zespołu, kliknij przycisk poniżej!`
      )
      .setColor(0x6f00ff)
      .setFooter({ text: 'Kliknij przycisk, aby zgłosić swoją kandydaturę.' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('zglos_zespol')
        .setLabel('Zgłoś się do zespołu')
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  },
};

// Event obsługi przycisku
export async function handleTeamButton(interaction) {
  if (!interaction.isButton() || interaction.customId !== 'zglos_zespol') return;

  // Wyślij potwierdzenie do użytkownika
  await interaction.reply({ content: 'Twoje zgłoszenie zostało wysłane do właściciela bota!', ephemeral: true });

  // Pobierz właściciela
  const owner = await interaction.client.users.fetch(OWNER_ID);

  // Przygotuj embed z informacjami o kandydacie
  const user = interaction.user;
  const embed = new EmbedBuilder()
    .setTitle('📨 Nowe zgłoszenie do zespołu')
    .addFields(
      { name: 'Nick', value: `${user.tag}`, inline: true },
      { name: 'ID', value: user.id, inline: true }
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setDescription(`Użytkownik <@${user.id}> zgłosił chęć dołączenia do zespołu.\nSerwer: ${interaction.guild?.name || 'DM'}\n`)
    .setColor(0x00cfff)
    .setTimestamp();

  await owner.send({ embeds: [embed] });
}