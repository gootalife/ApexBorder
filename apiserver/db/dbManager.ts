/* eslint no-useless-catch: 0 */
import { Connection, createConnection } from 'typeorm';
import config from '../config.json';
import { RPLog } from '../entities/rpLog';
import { Border } from '../entities/border';

export class DBManager {
  public static async getConnectionAsync(): Promise<Connection> {
    return await createConnection({
      type: 'postgres',
      host: config.env.db.host,
      port: config.env.db.port,
      username: config.env.db.user,
      password: config.env.db.password,
      database: config.env.db.database,
      synchronize: false,
      entities: [RPLog, Border],
      logging: false
    }).catch((e) => {
      throw e;
    });
  }
}
