import Privilege from "../types/Privilege";

let CommandClassInstances: Command[] = []
class Command {

    public name: string;
    public description: string;
    public requiredPrivilege: Privilege;
    public executable: CallableFunction;
    public path: string;
    public aliases: string[];
    
    constructor(
        name: string,
        description: string,
        requiredPrivilege: Privilege,
        executable: CallableFunction,
        path: string,
        aliases?: string[]
    )
    {
        this.name = name;
        this.description = description;
        this.requiredPrivilege = requiredPrivilege;
        this.executable = executable;
        this.path = path;
        this.aliases = aliases || []
        CommandClassInstances.push(this)
    }

    destroy() {
        CommandClassInstances.splice(CommandClassInstances.indexOf(this), 1)
    }
    
}

export default Command;
export { CommandClassInstances }