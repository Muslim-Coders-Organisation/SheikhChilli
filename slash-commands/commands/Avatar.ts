import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
	.setName('avatar')
	.setDescription('Returns the avatar of the mentioned user, or your own avatar')
	.addUserOption((option: any) => 
		option.setName("user")
		.setDescription("Specifies the user whos avatar you would like. Leaving this would return your own avatar.")
		.setRequired(false)
	)

export { data };