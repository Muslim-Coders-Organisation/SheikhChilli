import { TextChannel } from "discord.js";
import { Schedule, getAllSchedules, removeSchedule } from "../../data/schedule/scheduleTools";
import { getClient } from "../discord/Client";
import log from "./logger";

export const intervals: any[] = []

function beginScheduleRunner() {
    const schedules = getAllSchedules()
    schedules.forEach((e: Schedule) => {
        intervals.push([e.id, setInterval(() => { runSchedule(e) }, e.interval * 1000)])
        log("info", "schedule", `Commenced schedule ${e.id}`)
    })
}

function runSchedule(s: Schedule) {
    console.log("a")
    if (!getClient().guilds.cache.get(s.guild)?.members.cache.has(getClient()?.user?.id || "")) {
        removeSchedule(s.id)
    } else {
        if (!getClient().guilds.cache.get(s.guild)?.channels.cache.get(s.channel)?.viewable) {
            removeSchedule(s.id)
        } else {
            (getClient().guilds.cache.get(s.guild)?.channels.cache.get(s.channel) as TextChannel).send({
                content: s.message + (s.roles.length == 0 ? "" : "\n\n<@&" + s.roles[0] + ">")
            })
        }
    }

    return;
}

function restartInterval(schedule: Schedule) {
    console.log(intervals)
    intervals.forEach((e: [string, string]) => {
        if (e[0] == schedule.id) {
            clearInterval(e[1])
        }
    });

    intervals.push(schedule.id, setInterval(() => { runSchedule(schedule) }, schedule.interval * 1000))
    log("info", "schedule", `Recommenced schedule ${schedule.id}`)
}

function stopInterval(schedule: Schedule) {
    intervals.forEach((e: [string, string]) => {
        if (e[0] == schedule.id) {
            clearInterval(e[1])
        }
    });
}

function newInterval(schedule: Schedule) {
    intervals.push(schedule.id, setInterval(() => { runSchedule(schedule) }, schedule.interval * 1000))
    log("info", "schedule", `Commenced new schedule ${schedule.id}`)
}

export { beginScheduleRunner, restartInterval, stopInterval, newInterval }