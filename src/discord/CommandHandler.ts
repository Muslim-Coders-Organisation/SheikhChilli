import { CommandInteraction, Interaction } from "discord.js";
import config from "../../conf";
import Command, { CommandClassInstances } from "../classes/Command";

async function handle(i: Interaction) {
    if (i.isCommand()) await commandInteractionHandler(i)
    else return;
}

async function commandInteractionHandler(i: CommandInteraction) {
    CommandClassInstances.forEach((c: Command) => {
        if (c.name.toUpperCase() == i.commandName.toUpperCase()) c.executable(i || undefined);
        c.aliases.forEach((a: string) => {
            if (a.toUpperCase() == i.commandName.toUpperCase()) c.executable(i || undefined);
        })
    })
}

export default handle;