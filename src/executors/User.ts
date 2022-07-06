import { CommandInteraction, MessageEmbed, Role, User } from "discord.js";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("user", "Returns information about the mentioned user, or about yourself", "MEMBER", command, __filename, [])
function command(i: CommandInteraction) {
    const user: User = i.options.getUser("user") || i.user;
    const username: string = user.username;
    const discriminator: string = user.discriminator;
    const tag: string = user.tag;
    const isBot: boolean = user.bot;
    const id: string = user.id;
    const joinedServer: string = new Date(i.guild?.members?.cache?.get(user.id)?.joinedTimestamp || Date.now()).toLocaleDateString()
    const joinedDiscord: string = new Date(i.createdTimestamp).toLocaleDateString()
    const roles: string = i.guild?.members?.cache?.get(user.id)?.roles?.cache?.map((r: Role) => r).join(" | ") || "None"

    const e = new MessageEmbed()
        .setTitle(`Information about ` + username + "#" + discriminator)
        .setFooter({ text: "Information from " + i?.guild?.name })
        .setThumbnail(user.avatarURL({ dynamic: true }) || "")
        .setColor(getRandomColorHex())
        .setFields(
            {
                name: "User Info",
                value:
                    "```Username: " +
                    username +
                    "\nDiscriminator: #" +
                    discriminator +
                    "\nTag: " +
                    tag +
                    "\nAre they a bot? " +
                    (isBot == false ? "No" : "Yes") +
                    "\nID: " +
                    id +
                    " ```",
                inline: true,
            },
            {
                name: `Member Info`,
                value:
                    "```Joined Server: " +
                    joinedServer +
                    "\nJoined Discord: " +
                    joinedDiscord +
                    "```",
                inline: false,
            },
            {
                name: `Roles`,
                value:
                    "" +
                    roles +
                    "",
                inline: true,
            }
    ).setTimestamp();

    i.reply({embeds:[e]})
}