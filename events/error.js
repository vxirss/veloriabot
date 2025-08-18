import { Client, EmbedBuilder } from 'discord.js';

const OWNER_ID = '1179471266592333929'; // <-- Twój Discord user ID

export default {
  name: 'error',
  async execute(error) {
    console.error('Bot error:', error);

    try {
      const client = this instanceof Client ? this : global.client;
      const owner = await client.users.fetch(OWNER_ID);

      // Spróbuj znaleźć serwer, na którym wystąpił błąd (jeśli dostępny)
      let guildName = 'Nieznany serwer';
      if (error.guild && error.guild.name) {
        guildName = error.guild.name;
      } else if (error.guildId && client.guilds.cache.has(error.guildId)) {
        guildName = client.guilds.cache.get(error.guildId).name;
      }

      const embed = new EmbedBuilder()
        .setTitle('❗ Wystąpił błąd w bocie')
        .setDescription(`\`\`\`\n${error.stack || error}\n\`\`\``)
        .addFields({ name: 'Serwer', value: guildName })
        .setColor(0xff0000)
        .setTimestamp();

      if (owner) {
        await owner.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error('Nie udało się wysłać DM z błędem:', err);
    }
  },
};