import { existsSync } from "fs";
import config from "../../conf";
import InvalidConfigurationFileException from "../types/Exceptions/InvalidConfigurationFile";
import InvalidConfigurationKeyException from "../types/Exceptions/InvalidConfigurationKey";
import MissingStartupRequisiteException from "../types/Exceptions/MissingStartupRequisite";

function checkStartRequisites() {
    if (!existsSync(__dirname + "/../../conf.ts")) throw new MissingStartupRequisiteException("Missing configuration file! Use the template from config.ts.example to create one.")
    if (config.discord == undefined) throw new InvalidConfigurationFileException("Missing 'discord' key in the configuration. (config.discord)")
    if (config.discord.client_identifier == undefined) throw new InvalidConfigurationFileException("Missing 'client_identifier' key in the configuration under discord. (config.discord.client_identifier)")
    if (config.discord.token == undefined) throw new InvalidConfigurationFileException("Missing 'token' key in the configuration under discord. (config.discord.token)")

    if (config.discord.client_identifier.length != 18) throw new InvalidConfigurationKeyException("Key 'client_identifier' under discord is not the correct length. It is " + config.discord.client_identifier.length + ", client identifier length is 18.")
    if (config.discord.token.length < 10) throw new InvalidConfigurationKeyException("Key 'token' under discord is not the correct length. It is " + config.discord.token.length + ", token length is >10.")
} 

export default checkStartRequisites;