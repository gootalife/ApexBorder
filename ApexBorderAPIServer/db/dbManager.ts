import { createConnection, Connection } from "typeorm";
import { RPLog } from "../entities/rpLog";

export default class DBManager {
    private static connection: Connection;

    public static async createConnection(): Promise<void> {
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

    public static async getConnectedConnection(): Promise<Connection> {
        if (this.connection === undefined) {
            await this.createConnection().catch(err => { throw err });
        }
        if (this.connection.isConnected === false) {
            await this.connection.connect().catch(err => { throw err });
        }
        return this.connection;
    }
}