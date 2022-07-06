import { CommandInteraction, MessageEmbed, User } from "discord.js";
import Command from "../classes/Command";
import { getRandomColorHex } from "../utils/hexRandomizer";

new Command("avatar", "Returns the avatar of the mentioned user, or your own avatar", "MEMBER", command, __filename)
function command(i: CommandInteraction) {
    const user: User = i.options.getUser("user") || i.user

    const e = new MessageEmbed()
        .setTitle("Avatar of " + user.username + "#" + user.discriminator)
        .setColor(getRandomColorHex())

    if (typeof user.avatarURL() == null) e.setDescription(user.username + "'s avatar is null")
    else e.setImage(user.avatarURL({dynamic:true}) || "")

    i.reply({ embeds: [e] })
}