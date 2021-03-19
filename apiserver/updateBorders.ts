/* eslint no-useless-catch: 0 */
import moment from 'moment';
import { Connection } from 'typeorm';
import { DBManager } from './db/dbManager';
import { Border } from './entities/border';
import * as db from './db/dbFunction';

async function updateBordersAsync(): Promise<boolean> {
  let succeed = false;
  let connection: Connection;
  try {
    const borders = await db.fetchCurrentBordersAsync();
    connection = await DBManager.getConnectionAsync();
    const repository = connection.getRepository(Border);
    await repository.save(borders);
    succeed = true;
  } catch (e) {
    throw e;
  } finally {
    await connection.close();
  }
  return succeed;
};

console.log(`--- Update borders (${moment().format('YYYY-MM-DD HH:mm:ss')}) start ---`);
updateBordersAsync()
  .then(() => console.log('--- Update borders succeed ---'))
  .catch(e => {
    console.log('*** Update borders failed ***');
    console.log(e);
  });