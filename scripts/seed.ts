import config from "../conf";
import Database from "../src/database/DirectUtils";

(new Database(config.database)).seed()