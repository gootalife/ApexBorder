import DBManager from "./db/dbManager";
import { getConnection } from "typeorm";
import { RPLog } from "./entities/rpLog";

(async () => {
    console.log('--DBTest start--');
    await DBManager.createConnection();
    const connection = getConnection();
    console.log(connection.isConnected);
    connection.getRepository(RPLog);
    console.log('--DBTest end--');
})();
