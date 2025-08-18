import { getAutoModEnabled, getAutoModWords, getModerationLogChannel, getIdeasChannel, getLevelChannel } from '../database.js';
import { EmbedBuilder } from 'discord.js';
import { User } from '../database.js';

export default {
  name: 'messageCreate',
  async execute(message) {
    // Sprawdź czy wiadomość jest z serwera i nie jest bota
    if (!message.guild || message.author?.bot) return;

    // --- Automod ---
    const enabled = await getAutoModEnabled(message.guild.id);
    if (enabled) {
      const words = await getAutoModWords(message.guild.id);
      if (words.length) {
        const content = message.content?.toLowerCase() || '';
        const found = words.find(word => content.includes(word));
        if (found) {
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
                  { name: 'Powód', value: `Zabronione słowo: **${found}**`, inline: false }
                )
                .setDescription(`Treść wiadomości:\n\`\`\`\n${message.content}\n\`\`\``)
                .setColor(0xff0000)
                .setTimestamp();
              await logChannel.send({ embeds: [embed] });
            }
          }
          return; // Nie obsługuj dalej, jeśli automod usunął wiadomość
        }
      }
    }

    // --- Levelowanie / XP ---
    try {
      const userId = message.author.id;
      const guildId = message.guild.id;

      let userData = await User.findOne({ id: userId, guildId });
      if (!userData) {
        userData = new User({ id: userId, guildId, xp: 0, level: 1, points: 0 });
      }

      userData.xp += 10; // np. 10 XP za wiadomość
      userData.points += 1;

      // Przykładowy prosty system levelowania
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
    } catch (err) {
      console.error('XP/level error:', err);
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
  },
};