import { DBManager } from './db/dbManager';
import { RPLog } from './entities/rpLog';
import * as api from './logics/apiFunction';
import { Connection } from 'typeorm';

async function dailyAsync(): Promise<boolean> {
  let succeed = false;
  let message = '***Daily process failed***';
  let connection: Connection;
  try {
    console.log('---Daily process start---');
    const rpLog = await api.getCurrentRPRankingsAsync();
    console.log('DB Update start.');
    connection = await DBManager.getConnectionAsync();
    const repository = connection.getRepository(RPLog);
    await repository.save(rpLog);
    await connection.close();
    console.log('DB was Updated.');
    message = '---Daily process succeed---';
    succeed = true;
  } catch (e) {
    console.log(e.message);
  } finally {
    connection.close();
    console.log(message);
  }
  return succeed;
};

dailyAsync().catch(e => console.log(e.message));