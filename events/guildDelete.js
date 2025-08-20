import { clearGuildData } from '../database.js';

export default {
  name: 'guildDelete',
  async execute(guild) {
    try {
      await clearGuildData(guild.id);
      console.log(`Wyczyszczono dane serwera ${guild.id} (${guild.name}) z bazy.`);
    } catch (err) {
      console.error(`Błąd przy czyszczeniu danych serwera ${guild.id}:`, err);
    }
  }
};