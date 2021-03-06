import DBManager from "./db/dbManager";
import { RPLog } from "./entities/rpLog";

(async () => {
    console.log('--DBTest start--');
    const connection = await DBManager.getConnectedConnection();
    console.log('connected: ' + connection.isConnected);
    connection.getRepository(RPLog);
    await connection.close();
    console.log('--DBTest end--');
})();
