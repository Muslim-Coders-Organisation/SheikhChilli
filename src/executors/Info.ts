import { CommandInteraction, MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("info", "Returns information about the specified topic", "MEMBER", command, __filename)
function command(i: CommandInteraction) {
    let topic: string = i.options.getString("topic") || "";

    let e = new MessageEmbed()
        .setTitle("Information on " + topic.replace(topic[0], topic[0].toUpperCase()))
        .setColor(getRandomColorHex())
        .setDescription(
            `**${topic.replace(topic[0], topic[0].toUpperCase()) }**\n` + (readFileSync(__dirname + "/../../data/info/data/" + topic + ".txt", 'utf-8') || "Error while fetching data about " + topic)
        )
        .setTimestamp()

    i.reply({embeds:[e]})
}