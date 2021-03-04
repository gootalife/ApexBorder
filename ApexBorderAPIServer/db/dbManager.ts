import { createConnection } from "typeorm";
import { RPLog } from "../entities/rpLog";

export default class DBManager {
    public static async createConnection() {
        await createConnection({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: false,
            entities: [RPLog],
            logging: false,
        });
    }
}