import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Let a message be sent on an interval')
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a new schedule')
            .addStringOption(option => option.setName('interval').setDescription('Interval of which the message will be sent').setRequired(true))
            .addStringOption(option => option.setName("message").setDescription("Message to be sent on an interval").setRequired(true))
            .addChannelOption(option => option.setName("channel").setDescription("Channel to send the message in").setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('modify')
            .setDescription('Modify an existing schedule')
            .addStringOption(option => option.setName('id').setDescription('ID of the schedule').setRequired(true))
            .addStringOption(option => option.setName('interval').setDescription('Interval of which the message will be sent').setRequired(false))
            .addStringOption(option => option.setName("message").setDescription("Message to be sent on an interval").setRequired(false))
            .addChannelOption(option => option.setName("channel").setDescription("Channel to send the message in").setRequired(false))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a schedule')
            .addStringOption(option => option.setName('id').setDescription('ID of the schedule').setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('list').setDescription("Lists the existing schedules"))
    .addSubcommand(subcommand =>
        subcommand
            .setName('info').setDescription("Get the information of an existing schedule")
            .addStringOption(option => option.setName("id").setDescription("Schedule to get information of by ID (use '/schedule list' to find schedules)").setRequired(true))
    )


export { data };