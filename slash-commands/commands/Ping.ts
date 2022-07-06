import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Ensures bot uptime')

export { data };