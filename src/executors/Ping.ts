import { CommandInteraction, MessageEmbed } from "discord.js";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("ping", "Ensures bot uptime", "MEMBER", command, __filename)
function command(i: CommandInteraction) {
    if (i == null) return;
    if (i.client == null) return;
    if (i.client.uptime == null) return;

    i.reply({
        embeds: [
            new MessageEmbed()
                .setTitle("Waalaykum Assalam")
                .addField("Latency", i.createdTimestamp - Date.now() + "ms", true)
                .addField("Bot Uptime", i?.client?.uptime / 1000 + " seconds", true)
                .setColor(getRandomColorHex())
                .setTimestamp()
        ]
    })
}