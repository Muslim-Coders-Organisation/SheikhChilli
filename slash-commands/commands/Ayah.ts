import { SlashCommandBuilder } from '@discordjs/builders'

const data: any = new SlashCommandBuilder()
	.setName('ayah')
	.setDescription('Returns an ayah or a range of ayat from the Quran')
	.addNumberOption((option: any) => option.setName("chapter").setDescription("The chapter to get the verse from.").setRequired(true))
	.addNumberOption((option: any) => option.setName("verse").setDescription("The verse to get from the specified chapter").setRequired(true))
	.addNumberOption((option: any) => option.setName("end").setDescription("Get all verses between what was specified and the number inputted here").setRequired(false))
	//.addBooleanOption((option: any) => option.setName("include_transliteration").setDescription("Include the transliteration of the verse").setRequired(false))

export { data };