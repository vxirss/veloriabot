import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Load command data from files
const commands = [];
const commandsPath = path.join(process.cwd(), 'commands');

function getAllCommandFiles(dir) {
  let results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllCommandFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

for (const file of getAllCommandFiles(commandsPath)) {
  const commandPath = pathToFileURL(file).href;
  const command = await import(commandPath);
  if (!command.default?.data?.name || !command.default?.data?.description) {
    console.warn(`Komenda ${file} nie posiada nazwy lub opisu!`);
    continue;
  }
  // Skróć opis do 100 znaków (Discord API limit)
  let desc = command.default.data.description;
  if (desc.length > 100) desc = desc.slice(0, 97) + '...';

  // Skróć opisy opcji do 100 znaków
  let options = command.default.data.options ?? [];
  options = options.map(opt => ({
    ...opt,
    description: opt.description.length > 100 ? opt.description.slice(0, 97) + '...' : opt.description,
  }));

  commands.push({
    name: command.default.data.name,
    description: desc,
    options,
    default_member_permissions: command.default.data.default_member_permissions ?? undefined,
    filePath: file, // Dodaj ścieżkę pliku komendy
  });
  console.log('Ładuję komendę:', file, command.default.data.name);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    console.log('Slash commands registered!');
  } catch (error) {
    console.error(error);
  }
})();