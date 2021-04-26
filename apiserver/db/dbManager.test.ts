import { Connection } from 'typeorm';
import { DBManager } from './dbManager';
import { RPLog } from '../entities/rpLog';
import { Border } from '../entities/border';

describe('dbManagerTest', () => {
  test.skip('getConnectedConnectionAsyncTest', async () => {
    let connection: Connection;
    try {
      connection = await DBManager.getConnectionAsync();
      connection.getRepository(RPLog);
      connection.getRepository(Border);
      expect(connection.isConnected).toBe(true);
    } catch (e) {
      console.log(e.message);
    } finally {
      if (connection) {
        await connection.close();
        expect(connection.isConnected).toBe(false);
      }
    }
  });
});
