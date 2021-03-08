import DBManager from './db/dbManager';
import RPLog from './entities/rpLog';
import * as api from './logics/apiFunction';

const main = async () => {
  try {
    console.log('---Daily process start---');
    const rpLog = await api.getRPLists().catch(err => { throw err; });
    console.log('DB Update start.');
    const connection = await DBManager.getConnectedConnectionAsync();
    const repository = connection.getRepository(RPLog);
    await repository.save(rpLog);
    await connection.close();
    console.log('DB was Updated.');
  } catch (e) {
    console.log(e.message);
  } finally {
    await DBManager.closeConnectionAsync();
    console.log('---Daily process end---');
  }
};

main();