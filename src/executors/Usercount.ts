import { CommandInteraction, MessageEmbed } from "discord.js";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("usercount", "Returns the amount of users in the current guild", "MEMBER", command, __filename)
function command(i: CommandInteraction) {
    const usercount: number | string = i?.guild?.memberCount || "unknown"
    const e = new MessageEmbed()
        .setColor(getRandomColorHex())
        .setTitle('Member count')
        .setDescription("There are `" + usercount + "` users in this guild.")
    i.reply({embeds:[e]})
}