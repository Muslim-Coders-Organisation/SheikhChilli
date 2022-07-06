import { SlashCommandBuilder } from '@discordjs/builders'
import { existsSync } from 'fs';
import { infometadata } from '../../data/info/metadata';
import log from '../../src/utils/logger';

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Returns information about the specified topic')


let options: object[] = []
infometadata.forEach((topic: string) => {
    if (existsSync(__dirname + "/../../data/info/data/" + topic + ".txt")) {
        options.push({ "name": topic, "value": topic })
    } else {
        log("warn", "info", "Marked topic without data file! " + topic + " (excluding)")
    }
})

data.addStringOption((option: any) => 
    option.setName("topic")
        .setDescription("The topic of which you'd like information about")
        .setRequired(true)
        .addChoices(...options)
)

export { data };