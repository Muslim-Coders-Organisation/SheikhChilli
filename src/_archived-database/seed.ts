// Don't use this, I'm keeping this here for archival purposes.
import config from "../../conf";
//@ts-ignore
import Database from "../src/_database/DirectUtils";
(new Database(config.database)).seed()