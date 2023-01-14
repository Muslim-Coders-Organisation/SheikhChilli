function timeToSeconds(s: string): number {
    if (s.endsWith("s")) {
        return parseInt(s.replace("s", "")) * 1
    } else if (s.endsWith("m")) {
        return parseInt(s.replace("m", "")) * 60
    } else if (s.endsWith("h")) {
        return parseInt(s.replace("h", "")) * 60 * 60
    } else if (s.endsWith("d")) {
        return parseInt(s.replace("d", "")) * 60 * 60 * 24
    } else if (s.endsWith("w")) {
        return parseInt(s.replace("w", "")) * 60 * 60 * 24 * 7
    } else if (s.endsWith("mo")) {
        return parseInt(s.replace("mo", "")) * 60 * 60 * 24 * 30
    } else if (s.endsWith("y")) {
        return parseInt(s.replace("y", "")) * 60 * 60 * 24 * 365
    } else {
        return -1;
    }
}

export { timeToSeconds }