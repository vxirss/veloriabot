import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';

function safeString(str, max, def = 'Brak') {
  if (!str) return def;
  return str.length > max ? str.slice(0, max) : str;
}
function safeUrl(url) {
  if (!url) return undefined;
  try { new URL(url); return url; } catch { return undefined; }
}

export default {
  data: {
    name: 'embed',
    description: 'Tworzy własnego embeda z dowolnymi opcjami (tylko dla moderatorów).',
    options: [
      { name: 'tytul', description: 'Tytuł embeda', type: 3, required: true },
      { name: 'opis', description: 'Opis embeda', type: 3, required: true },
      { name: 'kolor', description: 'Kolor embeda (np. #5865F2 lub 5865F2)', type: 3, required: false },
      { name: 'url', description: 'Link do tytułu', type: 3, required: false },
      { name: 'obrazek', description: 'Obrazek (URL)', type: 3, required: false },
      { name: 'miniaturka', description: 'Miniaturka (URL)', type: 3, required: false },
      { name: 'stopka', description: 'Stopka', type: 3, required: false },
      { name: 'autor', description: 'Autor embeda', type: 3, required: false },
      { name: 'pole1_nazwa', description: 'Nazwa pola 1', type: 3, required: false },
      { name: 'pole1_wartosc', description: 'Wartość pola 1', type: 3, required: false },
      { name: 'pole1_inline', description: 'Pole 1 inline (true/false)', type: 5, required: false },
      { name: 'pole2_nazwa', description: 'Nazwa pola 2', type: 3, required: false },
      { name: 'pole2_wartosc', description: 'Wartość pola 2', type: 3, required: false },
      { name: 'pole2_inline', description: 'Pole 2 inline (true/false)', type: 5, required: false },
      { name: 'pole3_nazwa', description: 'Nazwa pola 3', type: 3, required: false },
      { name: 'pole3_wartosc', description: 'Wartość pola 3', type: 3, required: false },
      { name: 'pole3_inline', description: 'Pole 3 inline (true/false)', type: 5, required: false },
      { name: 'czas', description: 'Czy dodać timestamp (true/false)', type: 5, required: false },
    ],
    default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(), // tylko moderatorzy
  },
  async execute(interaction) {
    const title = safeString(interaction.options.getString('tytul'), 256, 'Embed');
    const description = safeString(interaction.options.getString('opis'), 4096, 'Brak opisu');
    let color = interaction.options.getString('kolor') || '#5865F2';
    const url = safeUrl(interaction.options.getString('url'));
    const image = safeUrl(interaction.options.getString('obrazek'));
    const thumbnail = safeUrl(interaction.options.getString('miniaturka')) || interaction.client.user.displayAvatarURL();
    const footer = safeString(interaction.options.getString('stopka'), 2048);
    const author = safeString(interaction.options.getString('autor'), 256);
    const timestamp = interaction.options.getBoolean('czas');

    // Pola
    const fields = [];
    for (let i = 1; i <= 3; i++) {
      const name = safeString(interaction.options.getString(`pole${i}_nazwa`), 256);
      const value = safeString(interaction.options.getString(`pole${i}_wartosc`), 1024);
      const inline = interaction.options.getBoolean(`pole${i}_inline`);
      if (name && value && name !== 'Brak' && value !== 'Brak') fields.push({ name, value, inline: !!inline });
    }

    // Popraw format koloru
    if (color.startsWith('#')) color = color.slice(1);
    if (!/^([A-Fa-f0-9]{6})$/.test(color)) color = '5865F2';

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(`#${color}`)
      .setThumbnail(thumbnail);

    if (url) embed.setURL(url);
    if (image) embed.setImage(image);
    if (footer) embed.setFooter({ text: footer });
    if (author) embed.setAuthor({ name: author });
    if (fields.length) embed.addFields(fields);
    if (timestamp) embed.setTimestamp();

    // Wyślij embed jako nową wiadomość na tym samym kanale
    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Embed został wysłany!', flags: 64 });
  },
};