import { CommandInteraction, MessageEmbed, User } from "discord.js";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("guild", "Gets information about the current guild", "MEMBER", command, __filename, ["server"])
function command(i: CommandInteraction) {
    const dateCreated: string = i.guild?.createdAt?.toLocaleString() || "Unknown"
    const owner: string = `${i.guild?.members?.cache?.get(i.guild?.ownerId)?.user.username}#${i.guild?.members?.cache?.get(i.guild?.ownerId)?.user?.discriminator}` || "Unknown"
    const memberCount = i.guild?.members.cache.size || 0
    const emojiCount = i.guild?.emojis?.cache?.size || 0
    const rolesCount = i.guild?.roles?.cache?.size || 0
    const channelsCount = i.guild?.channels?.cache?.size || 0

    const e = new MessageEmbed()
        .setTitle("Information about " + i.guild?.name)
        .setThumbnail(i.guild?.iconURL() || "")
        .setColor(getRandomColorHex())
        .setFields([
            {
                name: "**Date Created**",
                value: `Server created on **${dateCreated}**`,
            },
            {
                name: "**Owner**",
                value: `The owner of This Server is **${owner}**`,
            },
            {
                name: "**Member Count**",
                value:
                    "This server has ` " +
                    memberCount.toString() +
                    " ` **members**",
            },
            {
                name: "**Emoji Count**",
                value:
                    "This server has ` " +
                    emojiCount.toString() +
                    " ` **emojis**",
            },
            {
                name: "**Roles Count**",
                value:
                    "This server has ` " +
                    rolesCount.toString() +
                    " ` **roles**",
            },
            {
                name: "**Channels Count**",
                value:
                    "This server has ` " +
                    channelsCount.toString() +
                    " ` **channels**",
            },
        ])
        .setTimestamp();

    i.reply({embeds: [e]})
}