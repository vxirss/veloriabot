import { EmbedBuilder } from 'discord.js';
import { getMessagesLogChannel, getLogIgnoreChannels } from '../database.js';

export default {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.author?.bot) return;

    // Pobierz listę ignorowanych kanałów
    const ignoredChannels = await getLogIgnoreChannels(newMessage.guild.id);
    if (ignoredChannels.includes(newMessage.channel.id)) return;

    if (oldMessage.content === newMessage.content) return;

    // Ignoruj jeśli treść wiadomości po edycji przekracza 1024 znaki
    if (newMessage.content && newMessage.content.length > 1024) return;

    const logChannelId = await getMessagesLogChannel(newMessage.guild.id);
    if (!logChannelId) return;

    const logChannel = newMessage.guild.channels.cache.get(logChannelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const messageLink = `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`;

    const embed = new EmbedBuilder()
      .setTitle('✏️ Wiadomość edytowana')
      .setURL(messageLink)
      .addFields(
        { name: 'Autor', value: `<@${newMessage.author?.id}>` || '[Nieznany]', inline: true },
        { name: 'Kanał', value: `<#${newMessage.channel.id}>`, inline: true },
        { name: 'Przed', value: oldMessage.content || '[Brak wartości]' },
        { name: 'Po', value: newMessage.content || '[Brak wartości]' },
        { name: 'Skocz do wiadomości', value: `[Kliknij tutaj](${messageLink})` }
      )
      .setColor(0xFFFF00)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  },
};