import config from "../conf";
import Command, { CommandClassInstances } from "./classes/Command";
import { clientLogin } from "./discord/Client";
import checkStartRequisites from "./utils/checkStartRequisites";
import registerExecutors from "./utils/registerExecutors";

checkStartRequisites()
clientLogin(config.discord.token);
registerExecutors()