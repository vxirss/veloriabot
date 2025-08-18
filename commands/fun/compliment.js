import { SlashCommandBuilder } from 'discord.js';

const compliments = [
  'Masz świetny gust!',
  'Jesteś bardzo kreatywny/a!',
  'Twój uśmiech poprawia dzień!',
  'Jesteś inspiracją dla innych!',
  'Masz niesamowitą energię!',
  'Zawsze można na Ciebie liczyć!',
  'Twoja życzliwość jest zaraźliwa!',
  'Masz wyjątkowe poczucie humoru!',
  'Jesteś świetnym słuchaczem!',
  'Twoja obecność poprawia atmosferę!',
  'Jesteś bardzo pomocny/a!',
  'Twój entuzjazm motywuje innych!',
  'Masz wielkie serce!',
  'Jesteś bardzo inteligentny/a!',
  'Twój styl jest inspirujący!',
  'Zawsze wnosisz pozytywną energię!',
  'Jesteś wzorem do naśladowania!',
  'Twój optymizm jest niesamowity!',
  'Potrafisz rozbawić każdego!',
  'Jesteś wyjątkowy/a!'
];

export default {
  data: new SlashCommandBuilder()
    .setName('compliment')
    .setDescription('Wyślij komuś komplement')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Użytkownik do pochwały')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    await interaction.reply({
      content: `${user}, ${compliment}`,
      ephemeral: false
    });
  }
};
