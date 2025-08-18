import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildCreate',
  async execute(guild) {
    const adminChannelId = '1406335495566393345';

    const guildName = guild.name;
    const guildId = guild.id;
    const inviteLink = `https://discord.com/channels/${guildId}`;
    const memberCount = guild.memberCount;

    // Pobierz klienta bota
    const client = guild.client || guild.members.me.client;

    // Pobierz właściciela serwera
    let ownerTag = 'Nieznany';
    let ownerId = guild.ownerId;
    let owner;
    try {
      owner = await guild.fetchOwner();
      ownerTag = `${owner.user.tag} (${owner.id})`;
    } catch {
      if (ownerId) ownerTag = `ID: ${ownerId}`;
    }

    // Pobierz logo serwera
    const iconURL = guild.iconURL({ size: 256, extension: 'png' });

    // Przygotuj embed dla kanału administracyjnego
    const embed = new EmbedBuilder()
      .setTitle('✅ Bot dodany na nowy serwer!')
      .addFields(
        { name: 'Serwer', value: `${guildName}`, inline: true },
        { name: 'ID serwera', value: `\`${guildId}\``, inline: true },
        { name: 'Członkowie', value: `${memberCount}`, inline: true },
        { name: 'Właściciel', value: ownerTag, inline: false },
        { name: 'Strona bota', value: '[veloria-bot.pl](https://veloria-bot.pl/)', inline: false }
      )
      .setColor(0x57F287)
      .setTimestamp();

    if (iconURL) {
      embed.setThumbnail(iconURL);
    }

    // Wyślij embed na kanał administracyjny
    const adminChannel = client.channels.cache.get(adminChannelId);
    if (adminChannel && adminChannel.isTextBased()) {
      await adminChannel.send({ embeds: [embed] });
    }

    // --- NOWA FUNKCJA: Wyślij DM do właściciela serwera ---
    if (owner) {
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle('Dziękujemy za dodanie Veloria Bot!')
          .setDescription(
            `Cześć <@${owner.id}>!\n\n` +
            `Dziękujemy za dodanie Veloria Bot na swój serwer: **${guildName}**.\n\n` +
            `Możesz odebrać specjalną rolę na serwerze wsparcia za pomocą komendy \`/claim-role\`!\n\n` +
            `W razie pytań lub problemów dołącz na nasz serwer wsparcia: [Kliknij tutaj](https://discord.gg/MuhnahvU9u)`
          )
          .addFields(
            { name: 'Strona bota', value: '[veloria-bot.pl](https://veloria-bot.pl/)', inline: false }
          )
          .setColor(0x6f00ff)
          .setThumbnail(iconURL)
          .setFooter({ text: 'Veloria Bot', iconURL: 'https://cdn.discordapp.com/attachments/1405500301867487232/1406284112553185280/Veloria.png' })
          .setTimestamp();

        await owner.send({ embeds: [dmEmbed] });
      } catch (err) {
        console.error('Nie udało się wysłać DM do właściciela serwera:', err);
      }
    }
  },
};