# Sheikh-Chilli Bot

Sheikh Chilli is an open-source islamic-focused Discord bot. It is mainly made for the [Muslim Coders Discord Server](https://discord.gg/Vtnv3tBJem).
The Discord server is open to everyone, other than muslims as well.

This specific version of Sheikh Chilli is a rewritten version of [Sheikh-Bot](https://github.com/Muslim-Coders-Organisation/Sheikh-Bot)

---

## How to run

- Clone or pull this repository
- Install necessary dependencies with `npm i`
- Create a file called `conf.ts` and copy the contents of `conf.ts.example` to this file
- Fill in the conf.ts with your token and discord client identifier, as well as database credentials
- Run `npm run register` to register slash commands on your bot
- Optionally, you may run `npm run seed`. This script:
  - Creates the required tables
  - Injects the created tables with quran verses and chapter metadata
  - (Note: This downloads >3MB worth of SQL scripts, see the [queries branch](https://github.com/Muslim-Coders-Organisation/SheikhChilli/tree/queries))
  - (Other Note: This is automatically done on startup)
- Finally, run `npm start` to start the bot

---

## Documentation

## To create a new command

- create a file in the `/slash-commands/commands` folder and fill it in
- create a file in the `src/executors` folder.
- start this new `/src/executors` with the initialization of a new `Command` class.
- fill in the parameters of this Command class. (example below)
- write your code in the specified function

### Example

```ts
import { CommandInteraction } from "discord.js";
import Command from "../classes/Command";

new Command(
    "command name",
    "description",
    "MEMBER",
    command,
    __filename,
    ["av"]
)

function command(i: CommandInteraction) {
    // Code to run when interaction is executed
}
```

#### Some information to know about the `Command` class

There are 6 parameters

- `name`: The name of the command
- `description`: The description of the command
- `privilege`: The permission required to run said command. (NOTE: this has to be either `MEMBER`, `ADMIN`, or `AUTHOR`. This feature is not implemented yet.)
- `executable`: A function that is called when the command is called. It passes the interaction as a parameter.
- `path`: The path to the file. This isn't in use, but may be. `__filename` returns file path, so use that.
- `aliases`: (optional) a string array that contains the aliases of this command. Do keep in mind that all items in this array must have their own slash command in the `/slash-commands/commands` folder.

---

## Exceptions

### There are multiple exceptions that can occur while running this bot, here are their explanations

- `InvalidConfigurationFileException`: The `conf.ts` file is not of correct format
- `InvalidConfigurationKeyException`: One of the keys in `conf.ts` are not correct. (i.e. token length is <10)
- `MissingStartupRequisite`: You are missing a file required for startup, most likely `conf.ts`.
- All other errors relating to MySQL (fill in conf.ts!!)

---

## .env Template

```env
BOT_TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-client-id
```
