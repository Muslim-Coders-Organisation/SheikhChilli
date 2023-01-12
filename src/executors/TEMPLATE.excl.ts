import { CommandInteraction } from "discord.js";
import Command from "../classes/Command";

new Command(
    "command name",
    "description",
    "MEMBER", // Permission (MEMBER, ADMIN, or AUTHOR), Unused.
    command, // function to run (make sure to mention the function and not call the function)
    __filename, // keep this as it is
    ["av"] // aliases (can be left out) (aliases wont work unless you register them as an individual slash cmd)
)

function command(i: CommandInteraction) {
    // Code to run when interaction is executed
}