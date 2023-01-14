import { readFileSync, writeFileSync } from 'fs';
import { nanoid } from 'nanoid';

const SCHEDULE_FILENAME = __dirname + "/schedule.json"

type Schedule = {
    id: string,
    interval: number,
    message: string,
    channel: string,
    roles: string[],
    guild: string
}

type newScheduleInput = {
    interval: number,
    message: string,
    channel: string,
    roles: string[],
    guild: string
}

function generateID(): string {
    return nanoid(8)
}

function getAllSchedules(g?: string): Schedule[] {
    if (g != undefined) {
        const schedules: Schedule[] = JSON.parse(readFileSync(SCHEDULE_FILENAME, "utf-8"))
        const filtered = schedules.filter(e => {
            if (e.guild == g) {
                return e;
            }
        })
        return filtered;
    }
    return JSON.parse(readFileSync(SCHEDULE_FILENAME, "utf-8")) as Schedule[]
}

function getSchedule(id: string): Schedule | undefined {
    let returnValue: Schedule | undefined = undefined;
    getAllSchedules().forEach(e => {
        if (e.id == id) {
            returnValue = e
        }
    })
    return returnValue
}

function removeSchedule(id: string): boolean {
    let schedules = getAllSchedules()
    let schedule = getSchedule(id)
    if (schedule == undefined) return false;
    schedules.splice(schedules.indexOf(schedule), 1)
    writeFileSync(SCHEDULE_FILENAME, JSON.stringify(schedules))
    return true;
}

function changeSchedule(s: Schedule): boolean {
    let schedules = getAllSchedules()
    let schedule = getSchedule(s.id)
    if (schedule == undefined) return false;
    schedules.splice(schedules.indexOf(schedule))
    schedules.push(s)
    writeFileSync(SCHEDULE_FILENAME, JSON.stringify(schedules))
    return true;
}

function newSchedule(s: newScheduleInput): string {
    let schedules = getAllSchedules()
    let schedule: Schedule = {
        id: generateID(),
        interval: s.interval,
        message: s.message,
        channel: s.channel,
        roles: s.roles,
        guild: s.guild
    }

    schedules.push(schedule)
    writeFileSync(SCHEDULE_FILENAME, JSON.stringify(schedules))
    return schedule.id;
}

export { newSchedule, changeSchedule, removeSchedule, getAllSchedules, getSchedule, Schedule, newScheduleInput }