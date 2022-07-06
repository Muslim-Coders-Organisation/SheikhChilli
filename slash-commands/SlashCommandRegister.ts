const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
import log from '../src/utils/logger';
import config from '../conf'
const fs = require('node:fs');

const commands: any[] = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter((file: string) => file.endsWith('.ts'));
const aliasFiles = fs.readdirSync(__dirname + '/commands/aliases').filter((file: string) => file.endsWith('.ts'));

for (let file of commandFiles) {
	log("info", "Slash Command Register", "Registering command " + file.split(".")[0])
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

for (let file of aliasFiles) {
	log("info", "Slash Command Register", "Registering alias " + file.split(".")[0])
	const command = require(`./commands/aliases/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.discord.token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(config.discord.client_identifier),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();