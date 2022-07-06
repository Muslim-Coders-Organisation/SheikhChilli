import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
	.setName('guild')
	.setDescription('Gets information about the current guild')

export { data };