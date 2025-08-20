import { getAutoModEnabled, getAutoModWords, getModerationLogChannel } from '../database.js';
import { getLevelChannel } from '../database.js';
import { getIdeasChannel } from '../database.js';
import { User } from '../database.js';
import { getAutoModFlood, getAutoModCaps, getAutoModInvite } from '../database.js';
import { EmbedBuilder } from 'discord.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    if (!message.guild || message.author?.bot) return;

    // Automod: sprawdź wszystkie typy naruszeń
    const enabled = await getAutoModEnabled(message.guild.id);
    if (enabled) {
      const content = message.content || '';
      const lowerContent = content.toLowerCase();
      const words = await getAutoModWords(message.guild.id);
      const floodEnabled = await getAutoModFlood(message.guild.id);
      const capsEnabled = await getAutoModCaps(message.guild.id);
      const inviteEnabled = await getAutoModInvite(message.guild.id);

      let reason = null;

      // Słowa zabronione
      if (Array.isArray(words) && words.length) {
        for (const word of words) {
          if (word && lowerContent.includes(word)) {
            reason = `Zabronione słowo: **${word}**`;
            break;
          }
        }
      }

      // Flood (3+ powtarzające się znaki)
      if (!reason && floodEnabled) {
        if (/(.)\1{2,}/.test(content)) {
          reason = 'Flood (powtarzające się znaki)';
        }
      }

      // Caps (ponad 70% wielkich liter, min. 10 znaków)
      if (!reason && capsEnabled) {
        const letters = content.replace(/[^a-zA-Z]/g, '');
        if (letters.length >= 10) {
          const capsCount = letters.split('').filter(l => l === l.toUpperCase()).length;
          if (capsCount / letters.length > 0.7) {
            reason = 'Nadmierny capslock';
          }
        }
      }

      // Linki zaproszeń Discord
      if (!reason && inviteEnabled) {
        if (/discord(?:\.gg|app\.com\/invite)\/[a-zA-Z0-9]+/.test(lowerContent)) {
          reason = 'Link zaproszenia do innego Discorda';
        }
      }

      if (reason) {
        await message.delete();
        // Logowanie do kanału moderacyjnego
        const logChannelId = await getModerationLogChannel(message.guild.id);
        if (logChannelId) {
          const logChannel = message.guild.channels.cache.get(logChannelId);
          if (logChannel && logChannel.isTextBased()) {
            const embed = new EmbedBuilder()
              .setTitle('🚨 Automod: Usunięto wiadomość')
              .addFields(
                { name: 'Użytkownik', value: `<@${message.author.id}>`, inline: true },
                { name: 'Kanał', value: `<#${message.channel.id}>`, inline: true },
                { name: 'Powód', value: reason, inline: false }
              )
              .setDescription(`Treść wiadomości:\n\`\`\`\n${message.content}\n\`\`\``)
              .setColor(0xff0000)
              .setTimestamp();
            await logChannel.send({ embeds: [embed] });
          }
        }
        return;
      }
    }

    // --- SYSTEM POZIOMÓW ---
    // Pobierz lub utwórz dane użytkownika
    const userId = message.author.id;
    const guildId = message.guild.id;
    let userData = await User.findOne({ id: userId, guildId });
    if (!userData) {
      userData = new User({ id: userId, guildId, xp: 0, level: 1 });
    }
    // Przykładowa logika XP/level (dodaj XP za wiadomość)
    userData.xp = (userData.xp || 0) + 10;
    // Przykładowy próg awansu (możesz zmienić na własny algorytm)
    const nextLevelXp = userData.level * 100;
    let leveledUp = false;
    if (userData.xp >= nextLevelXp) {
      userData.level += 1;
      leveledUp = true;
    }
    await userData.save();
    // Ogłoszenie awansu na wyznaczonym kanale
    if (leveledUp) {
      const levelChannelId = await getLevelChannel(guildId);
      if (levelChannelId) {
        const levelChannel = message.guild.channels.cache.get(levelChannelId);
        if (levelChannel && levelChannel.isTextBased()) {
          await levelChannel.send(
            `🎉 <@${userId}> zdobył poziom ${userData.level}! Gratulacje!`
          );
        }
      }
    }
    // --- Propozycje (kanał idei) ---
    const ideasChannelId = await getIdeasChannel(message.guild.id);
    if (ideasChannelId && message.channel.id === ideasChannelId) {
      // Zamień wiadomość w embed
      const embed = new EmbedBuilder()
        .setTitle('💡 Propozycja')
        .setDescription(message.content)
        .setFooter({ text: `Autor: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor(0x00cfff)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      const sentMsg = await message.channel.send({ embeds: [embed] });
      await sentMsg.react('✅');
      await sentMsg.react('❌');
      await message.delete();
    }
  }
};
