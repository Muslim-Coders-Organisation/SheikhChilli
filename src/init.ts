import dotenv from 'dotenv';
dotenv.config()
import { beginScheduleRunner } from "./utils/beginScheduleRunner";
import { clientLogin } from "./discord/Client";
import registerExecutors from "./utils/registerExecutors";
import InvalidConfigurationFileException from './types/Exceptions/InvalidConfigurationFile';

async function __init() {
  if (process.env["BOT_TOKEN"] == undefined
    || process.env["CLIENT_ID"] == undefined
    || process.env["BOT_TOKEN"].length != 70
    || process.env["CLIENT_ID"].length != 18) {
    throw new InvalidConfigurationFileException("Your .env file is not set correctly")
  }

  clientLogin(process.env["BOT_TOKEN"]);
  registerExecutors()
  beginScheduleRunner()
}

__init()