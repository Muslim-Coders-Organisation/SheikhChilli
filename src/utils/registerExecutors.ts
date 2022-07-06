import { readdirSync } from "fs";
import log from "./logger";

function registerExecutors(): void {
	let r: string[] = []
	let i = 0
	readdirSync(__dirname + '/../executors').forEach((file: string) => { 
		if (file.endsWith('.ts') && !file.endsWith(".excl.ts")) {
			i++
			import("../executors/" + file)
			r.push(file.replace('.ts', '').toLowerCase())
		}
	})
	log("info", "executors", `Registered ${i} command executors: ` + r.join(", "))
}

export default registerExecutors;