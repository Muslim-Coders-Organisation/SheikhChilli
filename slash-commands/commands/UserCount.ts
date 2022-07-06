import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
	.setName('usercount')
	.setDescription('Returns the amount of users in the current guild')

export { data };