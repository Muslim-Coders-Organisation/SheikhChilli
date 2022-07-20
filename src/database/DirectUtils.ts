/*

Filename is self-explanatory.
This is file that allows direct access to the database.
however you should probably use the indirect functions instead.

*/

import { Connection, createConnection, Pool, Query } from 'mysql';
import axios from 'axios';
import log from '../utils/logger';


type DatabaseOptions = { host: string; port: number; username: string; password: string; database: string };
type ExistTools = {
  table: (name: string, callback: (res: any) => void) => Promise<void>,
};

/** This is used for direct access to the database. */
class Database {

  protected options: DatabaseOptions = {} as DatabaseOptions;
  protected sql: Connection | null;

  constructor(opt: DatabaseOptions) {
    this.sql = null;
    this.options = opt;
  }

  async connect(): Promise<Connection> {
    if (this.sql == null) {
      try {
        this.sql = createConnection
          ({
            host: this.options.host,
            port: this.options.port,
            user: this.options.username,
            password: this.options.password,
          });
        await this.update("CREATE DATABASE IF NOT EXISTS " + this.options.database);
        await this.update("USE " + this.options.database);
        return this.sql;
      } catch (ex: any) {
        throw ex;
      }
    } else {
      return this.sql
    }
  }

  async destroy(): Promise<void> {
    if (this.sql == null) {
      return;
    } else {
      try {
        this.sql.destroy()
      } catch (ex: any) {
        throw ex;
      }
    }
  }

  async query(q: string, callback?: (res: any, err: any) => void): Promise<any> {
    if (this.sql == null) {
      throw new Error('No database connection');
    } else {
      if (typeof callback === "undefined") {
        let RESULTS = null;
        await this.sql.query(q, (err: any, res: any) => {
          if (err) RESULTS = err;
          RESULTS = res;
        });
        
        while (RESULTS === null) {
          await new Promise(resolve => setTimeout(resolve, 15));
        } 

        return RESULTS;
      }
      else this.sql.query(q, (err: any, res: any) => callback(res, err));
    }
  }

  /** Same as query() but doesn't return anything, great for INSERT. */
  async update(q: string): Promise<void> {
    if (this.sql == null) {
      throw new Error('No database connection');
    } else {
      const query = this.sql.query(q, (err: any, res: any) => {
        if (err) return;
      });
    }
  }

  exists(): ExistTools {
    return {
      table: async (table: string, callback: (res: any) => void) => {
        const QUERY = `SELECT * FROM ${this.options.database}.${table} LIMIT 1`;
        await this.query(QUERY, (res) => {
          if (res == false) callback(false)
          callback(true);
        });
      },
    }
  }

  async seed(): Promise<void> {
    let QUERY; // just a variable which can be used to store the query
    if (this.sql == null) {
      throw new Error('No database connection');
    } else {
      try {

        await (await this.exists()).table("quran", async (isExisting) => {
          if (!isExisting) {
            log("warn", "database", "Missing 'quran' table, creating and seeding now.");
            let DATA = await axios.get("https://raw.githubusercontent.com/Muslim-Coders-Organisation/SheikhChilli/queries/dist/quran-table-query.sql").then(res => {
              return res.data;
            })
            await this.update(DATA);
            DATA = await axios.get("https://raw.githubusercontent.com/Muslim-Coders-Organisation/SheikhChilli/queries/dist/quran-queries.sql").then(res => {
              return res.data.split("\n");
            })
            for (let i = 0; i < DATA.length; i++) {
              QUERY = DATA[i];
              if (QUERY.length > 0) {
                this.update(QUERY);
              }
            }
            log("info", "database", "Table 'quran' created and seeded successfully.");
          } else {
          }
        }).catch(() => { })

        await (await this.exists()).table("surah", async (isExisting) => {
          if (!isExisting) {
            log("warn", "database", "Missing 'surah' table, creating and seeding now.");
            let DATA = await axios.get("https://raw.githubusercontent.com/Muslim-Coders-Organisation/SheikhChilli/queries/dist/chapter-metadata-table-query.sql").then(res => {
              return res.data;
            })
            this.update(DATA)
            DATA = await axios.get("https://raw.githubusercontent.com/Muslim-Coders-Organisation/SheikhChilli/queries/dist/chapter-metadata-queries.sql").then(res => {
              return res.data.split("\n");
            })
            for (let i = 0; i < DATA.length; i++) {
              QUERY = DATA[i];
              if (QUERY.length > 0) {
                await this.update(QUERY);
              }
            }
            log("info", "database", "Table 'surah' created and seeded successfully.");
          } else {
          }
        }).catch(() => { })

      } catch (ex: any) {
        throw ex;
      } finally {
        log("info", "database", "Seeding is complete or nothing had to be done... (inShaAllah)");
      }
    }
  }

  getSQLObject(): Connection | null {
    return this.sql
  }

}

export default Database;