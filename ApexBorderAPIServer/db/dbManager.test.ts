import { Connection } from 'typeorm';
import { DBManager } from './dbManager';

describe('dbManagerTest', () => {
  test('getConnectedConnectionAsyncTest', async () => {
    let connection: Connection;
    try {
      connection = await DBManager.getConnectionAsync();
      expect(connection.isConnected).toBe(true);
    } catch (e) {
      console.log(e.message);
    } finally {
      await connection.close();
      expect(connection.isConnected).toBe(false);
    }
  });
});