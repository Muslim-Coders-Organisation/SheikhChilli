import { CommandInteraction, Interaction, Message } from "discord.js";
import { shortenings } from "../../data/shortenings/shortenings";
import Command, { CommandClassInstances } from "../classes/Command";

async function msgHandle(m: Message) {
    shortenings.forEach((shortening: string[]) => {
        if (shortening[0].toUpperCase() == m.content.toUpperCase()) {
            m.channel.send(shortening[1])
        }
    })
}

export default msgHandle;