/* eslint no-useless-catch: 0 */
import { Connection, createConnection } from "typeorm";
import config from '../config.json';
import { RPLog } from "../entities/rpLog";

export class DBManager {
  private static connection: Connection;

  private static async createConnectionAsync(): Promise<void> {
    this.connection = await createConnection({
      type: 'postgres',
      host: config.env.db.HOST,
      port: config.env.db.PORT,
      username: config.env.db.USER,
      password: config.env.db.PASSWORD,
      database: config.env.db.DATABASE,
      synchronize: false,
      entities: [RPLog],
      logging: false,
    }).catch(e => { throw e });
  }

  public static async getConnectedConnectionAsync(): Promise<Connection> {
    try {
      if (this.connection === undefined) {
        await this.createConnectionAsync();
      }
      if (this.connection.isConnected === false) {
        await this.connection.connect();
      }
    } catch (e) {
      throw e;
    }
    return this.connection;
  }

  public static async closeConnectionAsync(): Promise<Connection> {
    try {
      if (this.connection !== undefined && this.connection.isConnected === true) {
        await this.connection.close();
      }
    } catch (e) {
      throw e;
    }
    return this.connection;
  }
}