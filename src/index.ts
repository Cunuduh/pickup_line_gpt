import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, Events, Interaction } from 'discord.js';
import { CommandModule } from './interfaces';

const token = process.env.BOT_TOKEN;
const client = new Client({ intents: [] });
const commands: Collection<string, any> = new Collection();
const commandFiles = fs.readdirSync('src/commands').filter((file: string) => file.endsWith('.ts'));

commandFiles.forEach((file: string) => {
	const filePath = path.join('src/commands', file);
	const command: CommandModule = require(filePath);
    commands.set(command.data.name, command);
});

client.login(token);
console.log(client);

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    const command: CommandModule = commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});