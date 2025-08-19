import { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { setVerifyChannel, setVerifyRole } from '../../database.js';

export default {
  data: {
    name: 'set-verify',
    description: 'Ustawia kanał i rolę do weryfikacji użytkowników.',
    options: [
      {
        name: 'kanał',
        description: 'Kanał, na którym pojawi się przycisk weryfikacji.',
        type: 7, // CHANNEL
        required: true,
        channel_types: [0], // GuildText
      },
      {
        name: 'rola',
        description: 'Rola, którą bot nada po weryfikacji.',
        type: 8, // ROLE
        required: true,
      },
      {
        name: 'wiadomość',
        description: 'Treść embeda weryfikacyjnego.',
        type: 3, // STRING
        required: false,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanał');
    const role = interaction.options.getRole('rola');
    const message = interaction.options.getString('wiadomość') || 'Kliknij przycisk poniżej, aby się zweryfikować i uzyskać dostęp do serwera!';

    if (!channel || channel.type !== 0) {
      return await interaction.reply({ content: 'Podany kanał nie jest tekstowy!', ephemeral: true });
    }
    if (!role) {
      return await interaction.reply({ content: 'Nie znaleziono podanej roli!', ephemeral: true });
    }

    await setVerifyChannel(interaction.guild.id, channel.id);
    await setVerifyRole(interaction.guild.id, role.id);

    const embed = new EmbedBuilder()
      .setTitle('✅ Weryfikacja użytkownika')
      .setDescription(message)
      .setColor(0x00cfff)
      .setFooter({ text: 'Kliknij przycisk, aby się zweryfikować.' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify_user')
        .setLabel('Zweryfikuj się')
        .setStyle(ButtonStyle.Success)
    );

    await channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({
      content: `Embed weryfikacyjny został wysłany na <#${channel.id}>. Rola do nadania: <@&${role.id}>.`,
      ephemeral: true,
    });
  },
};