import { EmbedBuilder } from 'discord.js';
import { getMessagesLogChannel, getLogIgnoreChannels } from '../database.js';

export default {
  name: 'messageDelete',
  async execute(message) {
    const ignoredChannels = await getLogIgnoreChannels(message.guild.id);
    if (ignoredChannels.includes(message.channel.id)) return;
    if (!message.guild || message.author?.bot) return;

    // Ignoruj jeśli treść wiadomości przekracza 1024 znaki
    if (message.content && message.content.length > 1024) return;

    const logChannelId = await getMessagesLogChannel(message.guild.id);
    if (!logChannelId) return;

    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Wiadomość usunięta')
      .addFields(
        { name: 'Autor', value: `<@${message.author?.id}>` || '[Nieznany]', inline: true },
        { name: 'Kanał', value: `<#${message.channel.id}>`, inline: true },
        { name: 'Treść', value: message.content || '[Brak wartości]' }
      )
      .setColor(0xFF0000)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  },
};