import { EmbedBuilder } from 'discord.js';

// Kategorie i przypisane komendy
const categories = {
  "👑 Zespół": ['team'],
  "📈 Levelowanie": ['levels', 'rank', 'toggleLevels', 'deleteLvl', 'checkLvl'],
  "🛡️ Moderacja": ['ban', 'tempban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'purge', 'history', 'clearHistory', 'deleteCase', 'caseinfo', 'embed', 'modLogDelete', 'msgLogDelete'],
  "⚙️ Administracja": ['reload', 'shutdown', 'setWelcome', 'setVerify', 'setTicketLog', 'setTicketChannel', 'setModLog', 'setMessagesLog', 'setLvlChannel', 'setIdeas', 'setCreateChannel', 'setChannelTemplate', 'setAutoRole', 'logIgnore', 'listedChannels', 'deleteCreateChannels', 'deleteLvl', 'deleteCase', 'claimRole'],
  "💬 Ogólne": ['help', 'ping', 'info', 'userstats', 'history', 'caseinfo', 'embed'],
  "🎉 Zabawa": ['coinflip', '8ball', 'roll', 'compliment', 'cat', 'dog', 'ship'],
  "🔒 Prywatne Kanały": ['clearpvc', 'privatechannels', 'setcreatechannel', 'setchanneltemplate'],
  "📩 Tickety": ['ticket', 'ticketInfo'],
  "🎵 Muzyka": ['play'],
  "🎂 Urodziny": ['setBirthday', 'setBirthdayChannel']
};

export default {
  data: {
    name: 'help',
    description: 'Wyświetla listę komend podzielonych na kategorie',
  },
  async execute(interaction) {
    const commands = interaction.client.commands;
    const available = Array.from(commands.keys());

    // Mapowanie: komenda -> kategoria
    const commandToCategory = {};
    Object.entries(categories).forEach(([cat, cmds]) => {
      cmds.forEach(cmd => {
        commandToCategory[cmd] = cat;
      });
    });

    // Grupowanie dostępnych komend według kategorii
    const grouped = {};
    available.forEach(name => {
      const cat = commandToCategory[name] || 'Inne';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(name);
    });

    let desc = '';
    Object.entries(grouped).forEach(([cat, cmds]) => {
      desc += `**${cat}**\n`;
      desc += cmds
        .map(name => {
          const cmd = commands.get(name);
          return cmd ? `• \`/${cmd.data.name}\` — ${cmd.data.description}` : '';
        })
        .filter(Boolean)
        .join('\n');
      desc += '\n\n';
    });

    const embed = new EmbedBuilder()
      .setTitle('Komendy Bota Veloria')
      .setColor(0x6E6565)
      .setDescription(desc || 'Brak komend do wyświetlenia.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

