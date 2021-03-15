/* eslint no-useless-catch: 0 */
import moment from 'moment';
import { Connection } from 'typeorm';
import { DBManager } from './db/dbManager';
import { RPLog } from './entities/rpLog';
import * as api from './logics/apiFunction';

async function dailyAsync(): Promise<boolean> {
  let succeed = false;
  let connection: Connection;
  try {
    const rpLog = await api.getCurrentRPRankingsAsync();
    connection = await DBManager.getConnectionAsync();
    const repository = connection.getRepository(RPLog);
    await repository.insert(rpLog);
    succeed = true;
  } catch (e) {
    throw e;
  } finally {
    await connection.close();
  }
  return succeed;
};

console.log(`---Daily process (${moment().format('YYYY-MM-DD HH:mm:ss')}) start---`);
dailyAsync()
  .then(() => console.log('---Daily process succeed---'))
  .catch(e => {
    console.log('*** Daily process failed ***');
    console.log(e);
  });