/* eslint no-useless-catch: 0 */
import { createConnection, Connection } from "typeorm";
import RPLog from "../entities/rpLog";

export default class DBManager {
  private static connection: Connection;

  private static async createConnectionAsync(): Promise<void> {
    this.connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      entities: [RPLog],
      logging: false,
    }).catch(err => { throw err });
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

  public static async closeConnectionAsync(): Promise<void> {
    try {
      if (this.connection !== undefined && this.connection.isConnected === true) {
        await this.connection.close();
      }
    } catch (e) {
      throw e;
    }
  }
}