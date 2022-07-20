import { createConnection } from "mysql";
import config from "../conf";
import Command, { CommandClassInstances } from "./classes/Command";
import Database from "./database/DirectUtils";
import QuranUtils from "./database/IndirectUtils";
import { clientLogin } from "./discord/Client";
import checkStartRequisites from "./utils/checkStartRequisites";
import registerExecutors from "./utils/registerExecutors";

const DATABASE: Database = new Database(config.database);
const QURANUTIL: QuranUtils = new QuranUtils(DATABASE);

async function __init() {
  await DATABASE.connect();
  await DATABASE.seed()
  checkStartRequisites()
  clientLogin(config.discord.token);
  registerExecutors()
}

export function getDatabase(): Database {
  return DATABASE
}

__init()