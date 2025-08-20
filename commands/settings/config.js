import { PermissionFlagsBits } from 'discord.js';
import {
  setAutoModEnabled, setAutoModWords, setAutoModFlood, setAutoModCaps, setAutoModInvite,
  setWelcomeChannel, setWelcomeMessage, setWelcomeEnabled,
  setAutoRole, setTicketChannel, setTicketLogChannel, setModLog, setMessagesLogChannel,
  setLvlChannel, setIdeasChannel, setChannelTemplate, setCreateChannel
} from '../../database.js';

export default {
  data: {
    name: 'config',
    description: 'Zarządzaj ustawieniami serwera',
    options: [
      {
        name: 'automod',
        description: 'Ustawienia automoda',
        type: 1,
        options: [
          { name: 'enabled', description: 'Włącz/wyłącz automod', type: 5, required: false },
          { name: 'words', description: 'Słowa do usuwania (oddzielone przecinkami)', type: 3, required: false },
          { name: 'flood', description: 'Włącz/wyłącz usuwanie floodu', type: 5, required: false },
          { name: 'caps', description: 'Włącz/wyłącz usuwanie capsu', type: 5, required: false },
          { name: 'invite', description: 'Włącz/wyłącz usuwanie zaproszeń Discord', type: 5, required: false },
        ]
      },
      {
        name: 'welcome',
        description: 'Ustawienia powitania',
        type: 1,
        options: [
          { name: 'channel', description: 'Kanał powitania', type: 7, required: false },
          { name: 'message', description: 'Treść powitania', type: 3, required: false },
          { name: 'enabled', description: 'Włącz/wyłącz powitanie', type: 5, required: false },
        ]
      },
      {
        name: 'ticket',
        description: 'Ustawienia ticketów',
        type: 1,
        options: [
          { name: 'channel', description: 'Kanał ticketów', type: 7, required: false },
          { name: 'log', description: 'Kanał logów ticketów', type: 7, required: false },
        ]
      },
      {
        name: 'role',
        description: 'Ustawienia autoroli',
        type: 1,
        options: [
          { name: 'role', description: 'Rola do nadania', type: 8, required: false },
        ]
      },
      {
        name: 'log',
        description: 'Ustawienia logów',
        type: 1,
        options: [
          { name: 'modlog', description: 'Kanał logów moderacji', type: 7, required: false },
          { name: 'messageslog', description: 'Kanał logów wiadomości', type: 7, required: false },
          { name: 'ignore', description: 'Kanał ignorowany przez logi', type: 7, required: false },
        ]
      },
      {
        name: 'level',
        description: 'Ustawienia kanału poziomów',
        type: 1,
        options: [
          { name: 'lvlchannel', description: 'Kanał poziomów', type: 7, required: false },
          { name: 'enabled', description: 'Włącz/wyłącz system poziomów', type: 5, required: false },
        ]
      },
      {
        name: 'ideas',
        description: 'Ustawienia kanału pomysłów',
        type: 1,
        options: [
          { name: 'ideachannel', description: 'Kanał pomysłów', type: 7, required: false },
        ]
      },
      {
        name: 'template',
        description: 'Szablon kanału do tworzenia',
        type: 1,
        options: [
          { name: 'template', description: 'Szablon nazwy kanału', type: 3, required: false },
        ]
      },
      {
        name: 'createchannel',
        description: 'Kanał do tworzenia kanałów',
        type: 1,
        options: [
          { name: 'channel', description: 'Kanał do tworzenia', type: 7, required: false },
        ]
      },
    ],
  default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  async execute(interaction) {
    try {
  const group = interaction.options.getSubcommand(false);
      if (!group) {
        await interaction.reply({ content: 'Nie wybrano grupy ustawień.', ephemeral: true });
        return;
      }
      if (group === 'automod') {
        const enabled = interaction.options.getBoolean('enabled');
        const words = interaction.options.getString('words');
        const flood = interaction.options.getBoolean('flood');
        const caps = interaction.options.getBoolean('caps');
        const invite = interaction.options.getBoolean('invite');
        if (enabled !== null) await setAutoModEnabled(interaction.guild.id, enabled);
        if (words) await setAutoModWords(
          interaction.guild.id,
          words.split(',').map(w => w.trim().toLowerCase()).filter(Boolean)
        );
        if (flood !== null) await setAutoModFlood(interaction.guild.id, flood);
        if (caps !== null) await setAutoModCaps(interaction.guild.id, caps);
        if (invite !== null) await setAutoModInvite(interaction.guild.id, invite);
        await interaction.reply({ content: 'Ustawienia automoda zapisane!', ephemeral: true });
        return;
      }
      if (group === 'welcome') {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        const enabled = interaction.options.getBoolean('enabled');
        if (channel) await setWelcomeChannel(interaction.guild.id, channel.id);
        if (message) await setWelcomeMessage(interaction.guild.id, message);
        if (enabled !== null) await setWelcomeEnabled(interaction.guild.id, enabled);
        await interaction.reply({ content: 'Ustawienia powitania zapisane!', ephemeral: true });
        return;
      }
      if (group === 'ticket') {
        const channel = interaction.options.getChannel('channel');
        const log = interaction.options.getChannel('log');
        if (channel) await setTicketChannel(interaction.guild.id, channel.id);
        if (log) await setTicketLogChannel(interaction.guild.id, log.id);
        await interaction.reply({ content: 'Ustawienia ticketów zapisane!', ephemeral: true });
        return;
      }
      if (group === 'role') {
        const role = interaction.options.getRole('role');
        if (role) await setAutoRole(interaction.guild.id, role.id);
        await interaction.reply({ content: 'Ustawienia autoroli zapisane!', ephemeral: true });
        return;
      }
      if (group === 'log') {
        const modlog = interaction.options.getChannel('modlog');
        const messageslog = interaction.options.getChannel('messageslog');
        const ignore = interaction.options.getChannel('ignore');
        if (modlog) await setModLog(interaction.guild.id, modlog.id);
        if (messageslog) await setMessagesLogChannel(interaction.guild.id, messageslog.id);
        if (ignore) await setLogIgnoreChannel(interaction.guild.id, ignore.id);
        await interaction.reply({ content: 'Ustawienia logów zapisane!', ephemeral: true });
        return;
      }
      if (group === 'level') {
        const lvlchannel = interaction.options.getChannel('lvlchannel');
        const enabled = interaction.options.getBoolean('enabled');
        if (lvlchannel) await setLvlChannel(interaction.guild.id, lvlchannel.id);
        if (enabled !== null) await import('../../database.js').then(db => db.setLevelsEnabled(interaction.guild.id, enabled));
        await interaction.reply({ content: 'Ustawienia systemu poziomów zapisane!', ephemeral: true });
        return;
      }
      if (group === 'ideas') {
        const ideachannel = interaction.options.getChannel('ideachannel');
        if (ideachannel) await setIdeasChannel(interaction.guild.id, ideachannel.id);
        await interaction.reply({ content: 'Ustawienia kanału pomysłów zapisane!', ephemeral: true });
        return;
      }
      if (group === 'template') {
        const template = interaction.options.getString('template');
        if (template) await setChannelTemplate(interaction.guild.id, template);
        await interaction.reply({ content: 'Szablon kanału zapisany!', ephemeral: true });
        return;
      }
      if (group === 'createchannel') {
        const channel = interaction.options.getChannel('channel');
        if (channel) await setCreateChannel(interaction.guild.id, channel.id);
        await interaction.reply({ content: 'Kanał do tworzenia zapisany!', ephemeral: true });
        return;
      }
      await interaction.reply({ content: 'Nieznana grupa ustawień.', ephemeral: true });
    } catch (error) {
      console.error('Błąd w komendzie config:', error);
      await interaction.reply({ content: `Wystąpił błąd: ${error.message || error}`, ephemeral: true });
    }
  }
};
