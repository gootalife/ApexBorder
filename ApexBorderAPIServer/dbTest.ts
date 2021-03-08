import DBManager from "./db/dbManager";
import RPLog from "./entities/rpLog";

const main = async () => {
  try {
    console.log('--DBTest start--');
    const connection = await DBManager.getConnectedConnectionAsync();
    console.log('connected: ' + connection.isConnected);
    connection.getRepository(RPLog);
  } catch (e) {
    console.log(e.message);
  } finally {
    await DBManager.closeConnectionAsync();
    console.log('--DBTest end--');
  }
};

main();
