import { DBManager } from './db/dbManager';
import { RPLog } from './entities/rpLog';
import * as api from './logics/apiFunction';

const daily = async (): Promise<boolean> => {
  let succeed = false;
  let message = '***Daily process failed***';
  try {
    console.log('---Daily process start---');
    const rpLog = await api.getRPLists();
    console.log('DB Update start.');
    const connection = await DBManager.getConnectedConnectionAsync();
    const repository = connection.getRepository(RPLog);
    await repository.save(rpLog);
    await connection.close();
    console.log('DB was Updated.');
    message = '---Daily process succeed---';
    succeed = true;
  } catch (e) {
    console.log(e.message);
  } finally {
    await DBManager.closeConnectionAsync();
    console.log(message);
  }
  return succeed;
};

daily();