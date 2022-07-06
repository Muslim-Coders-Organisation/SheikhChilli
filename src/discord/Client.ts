import { Client, Interaction } from 'discord.js';
import { Intents } from 'discord.js';
import log, { errorLog } from '../utils/logger';
import handle from './CommandHandler'

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES];
const client = new Client({ intents: intents });

client.on('interactionCreate', async (i: Interaction) => await handle(i))

function clientLogin(token: string): void {
    try { client.login(token) }
    catch (e: unknown) { errorLog("Error while client login", true) }
    log("info", "discord", "Successful client login")
}

function getClient(): Client { return client; }

export { getClient, clientLogin }