import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
	.setName('user')
	.setDescription('Returns information about the mentioned user, or about yourself')
	.addUserOption((option: any) =>
		option.setName("user")
		.setDescription("The user you would like information about")
		.setRequired(false)
	)

export { data };