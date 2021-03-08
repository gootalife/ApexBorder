import { DBManager } from './db/dbManager';
import { RPLog } from './entities/rpLog';
import * as api from './logics/apiFunction';

const daily = async (): Promise<boolean> => {
  let succeed = false;
  try {
    console.log('---Daily process start---');
    const rpLog = await api.getRPLists();
    console.log('DB Update start.');
    const connection = await DBManager.getConnectedConnectionAsync();
    const repository = connection.getRepository(RPLog);
    await repository.save(rpLog);
    await connection.close();
    console.log('DB was Updated.');
    console.log('---Daily process end---');
    succeed = true;
  } catch (e) {
    console.log(e.message);
  } finally {
    await DBManager.closeConnectionAsync();
    console.log('---Daily process failed---');
  }
  return succeed;
};

daily();