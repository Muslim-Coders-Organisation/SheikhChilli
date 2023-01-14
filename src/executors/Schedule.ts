import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import Command from "../classes/Command";
import { Schedule, changeSchedule, getAllSchedules, getSchedule, newSchedule, newScheduleInput, removeSchedule } from "../../data/schedule/scheduleTools";
import { timeToSeconds } from '../utils/convertTimeToSeconds'
import { newInterval, restartInterval, stopInterval } from "../utils/beginScheduleRunner";
const { PermissionsBitField } = require('discord.js');

new Command(
    "schedule",
    "Let a message be sent on an interval",
    "MEMBER", // Permission (MEMBER, ADMIN, or AUTHOR), Unused.
    command, // function to run (make sure to mention the function and not call the function)
    __filename, // keep this as it is
    [""] // aliases (can be left out) (aliases wont work unless you register them as an individual slash cmd)
)

function command(i: CommandInteraction) {
    if (i.options.getSubcommand() == "list") listSchedules(i);
    if (i.options.getSubcommand() == "create") createSchedule(i);
    if (i.options.getSubcommand() == "modify") modifySchedule(i);
    if (i.options.getSubcommand() == "delete") deleteSchedule(i);
    if (i.options.getSubcommand() == "info") infoSchedule(i);
}

function createSchedule(i: CommandInteraction) {
    if (!i.guild?.members?.cache?.get(i.user.id)?.permissions.has("ADMINISTRATOR")) {
        i.reply({
            content: "You do not have permission to run this command.",
            ephemeral: true
        })
        return;
    }

    const interval = i.options.getString("interval");
    const message = i.options.getString("message");
    const channel = i.options.getChannel("channel");
    const role = i.options.getRole("role") || null;

    if (interval == null || message == null || channel == null) {
        return;
    }

    if (timeToSeconds(interval) == -1 || timeToSeconds(interval) < 240) {
        i.reply({
            content: "An error occured with the interval argument. Make sure it is in a format such as `1m`, `77s`, etc.\n Also make sure that the duration is longer than 240 seconds (4 minutes) to avoid spam.",
            ephemeral: true
        })
        return;
    }

    if (message.length > 4096) {
        i.reply({
            content: "An error occured with the message length. Make sure it is shorter than 4096 characters as this is Discord's message limit.",
            ephemeral: true
        })
        return;
    }

    if (!i.guild?.channels.cache.get(channel.id)?.viewable) {
        i.reply({
            content: "I am unable to see the channel that you specified. Make sure I have access to the channel.",
            ephemeral: true
        })
        return;
    }

    const schedule: newScheduleInput = {
        interval: timeToSeconds(interval),
        message: message,
        channel: channel.id,
        roles: (role == null ? [] : [role.id]),
        guild: i.guild?.id
    }

    const id = newSchedule(schedule)
    newInterval({
        id: id,
        interval: schedule.interval,
        message: schedule.message,
        channel: schedule.channel,
        roles: schedule.roles,
        guild: schedule.guild
    })

    i.reply({
        embeds: [
            new MessageEmbed()
                .setTitle("A new schedule was created!")
                .setDescription("View details using `/schedule info " + id + "`")
                .setColor("#2A9D8F" as ColorResolvable)
                .setTimestamp()
        ]
    })
}

function modifySchedule(i: CommandInteraction) {
    if (!i.guild?.members?.cache?.get(i.user.id)?.permissions.has("ADMINISTRATOR")) {
        i.reply({
            content: "You do not have permission to run this command.",
            ephemeral: true
        })
        return;
    }

    const schedule = i.options.getString("id") || null;
    if (schedule == null) return;
    const ScheduleInfo = getSchedule(schedule)

    if (ScheduleInfo == undefined || ScheduleInfo.guild != i.guild?.id) {
        i.reply({
            content: "Schedule does not exist!",
            ephemeral: true
        })
        return;
    } else {

        console.log(i.options.getString("interval"))
        if (i.options.getString("interval") != null && i.options.getString("interval") != undefined) {
            if (timeToSeconds(i.options.getString("interval") || ".") == -1 || timeToSeconds(i.options.getString("interval") || ".") < 240) {
                i.reply({
                    content: "An error occured with the interval argument. Make sure it is in a format such as `1m`, `77s`, etc.\n Also make sure that the duration is longer than 240 seconds (4 minutes) to avoid spam.",
                    ephemeral: true
                })
                return;
            }
        }

        if (i.options.getString("message") != null && i.options.getString("message") != undefined) {
            //@ts-ignore
            if (i?.options?.getString("message")?.length > 4096) {
                i.reply({
                    content: "An error occured with the message length. Make sure it is shorter than 4096 characters as this is Discord's message limit.",
                    ephemeral: true
                })
                return;
            }
        }

        if (i.options.getChannel("channel") != null && i.options.getChannel("channel") != undefined) {
            //@ts-ignore
            if (!i.guild?.channels.cache.get(channel.id)?.viewable) {
                i.reply({
                    content: "I am unable to see the channel that you specified. Make sure I have access to the channel.",
                    ephemeral: true
                })
                return;
            }
        }

        const modifiedSchedule: Schedule = {
            id: ScheduleInfo.id,
            interval: (i.options.getString("interval") == null ? ScheduleInfo?.interval : timeToSeconds(i.options.getString("interval") as string)) as number,
            message: (i.options.getString("message") == null ? ScheduleInfo?.message : i.options.getString("message")) as string,
            channel: (i.options.getChannel("channel") == null ? ScheduleInfo?.channel : i.options.getString("channel")) as string,
            roles: (i.options.getRole("role") == null ? ScheduleInfo?.roles : [i.options.getRole("role")]) as string[],
            guild: ScheduleInfo.guild
        }

        changeSchedule(modifiedSchedule)
        restartInterval(modifiedSchedule)
        i.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Schedule was successfully modified.")
                    .setDescription("View the new details using `/schedule info " + schedule + "`")
                    .setColor("#2A9D8F" as ColorResolvable)
                    .setTimestamp()
            ]
        })
    }
}

function deleteSchedule(i: CommandInteraction) {
    if (!i.guild?.members?.cache?.get(i.user.id)?.permissions.has("ADMINISTRATOR")) {
        i.reply({
            content: "You do not have permission to run this command.",
            ephemeral: true
        })
        return;
    }

    const Schedule = i.options.getString("id") || null;
    if (Schedule == null) return;
    const ScheduleInfo = getSchedule(Schedule)
    if (ScheduleInfo == undefined || ScheduleInfo.guild != i.guild?.id) {
        i.reply({
            content: "Schedule does not exist!",
            ephemeral: true
        })
        return;
    } else {
        removeSchedule(Schedule)
        stopInterval(ScheduleInfo)

        i.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Schedule " + Schedule + " was deleted.")
                    .setColor("#2A9D8F" as ColorResolvable)
                    .setTimestamp()
            ]
        })
    }
}


function listSchedules(i: CommandInteraction) {
    if (!i.guild?.members?.cache?.get(i.user.id)?.permissions.has("ADMINISTRATOR")) {
        i.reply({
            content: "You do not have permission to run this command.",
            ephemeral: true
        })
        return;
    }

    const Schedules = getAllSchedules(i.guild?.id)
    let embed = new MessageEmbed()
        .setTitle("Schedules for " + i.guild?.name)

    if (Schedules.length == 0) {
        embed.setDescription("You have no schedules. Create one with `/schedule create`")
    } else {
        embed.setDescription("For more information, run `/schedule info <id>`")
        Schedules.forEach(e => {
            embed.addField(e.id.toString(), "Every " + e.interval.toString() + " seconds", true)
        })
    }

    i.reply({
        embeds: [embed]
    })
}

function infoSchedule(i: CommandInteraction) {
    if (!i.guild?.members?.cache?.get(i.user.id)?.permissions.has("ADMINISTRATOR")) {
        i.reply({
            content: "You do not have permission to run this command.",
            ephemeral: true
        })
        return;
    }

    const Schedule = getSchedule(i.options.getString("id") || "")
    if (Schedule == undefined || Schedule.guild != i.guild?.id) {
        i.reply({
            embeds: [
                new MessageEmbed().setTitle("Schedule does not exist!").setDescription("Schedule with ID `" + (i.options.getString("id") || "nil") + "` does not exist.")
            ]
        })
        return;
    } else {
        const embed = new MessageEmbed()
            .setTitle("Schedule Information (" + Schedule.id + ")")
            .addFields([
                { "name": "ID", "value": Schedule.id, "inline": true },
                { "name": "Interval", "value": Schedule.interval.toString(), "inline": true },
                { "name": "Channel", "value": "<#" + Schedule.channel + ">", "inline": true },
                {
                    "name": "Role Ping", "value": (Schedule.roles.length != 0 ? "<@&" + Schedule.roles[0] + ">" : "None"), "inline": true
                },
                {
                    "name": "Message", "value": Schedule.message, "inline": true
                }
            ])

        i.reply({
            embeds: [embed]
        })
        return;
    }
}