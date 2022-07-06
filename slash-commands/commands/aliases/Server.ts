import { SlashCommandBuilder } from '@discordjs/builders'

// Alias of: Guild

const data = new SlashCommandBuilder()
	.setName('server')
	.setDescription('Gets information about the current guild')

export { data };