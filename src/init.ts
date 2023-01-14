import { createConnection } from "mysql";
import config from "../conf";
import Command, { CommandClassInstances } from "./classes/Command";
import { clientLogin } from "./discord/Client";
import checkStartRequisites from "./utils/checkStartRequisites";
import registerExecutors from "./utils/registerExecutors";
import { beginScheduleRunner } from "./utils/beginScheduleRunner";

async function __init() {
  checkStartRequisites()
  clientLogin(config.discord.token);
  registerExecutors()
  beginScheduleRunner()
}

__init()