import { DBManager } from './dbManager';

describe('dbManagerTest', () => {
  test('getConnectedConnectionAsyncTest', async () => {
    const connection = await DBManager.getConnectedConnectionAsync();
    expect(connection.isConnected).toBe(true);
  });
  test('getCurrentBordersAsync', async () => {
    const connection = await DBManager.closeConnectionAsync();
    expect(connection.isConnected).toBe(false);
  });
  test('getConnectedConnectionAsyncAgainTest', async () => {
    const connection = await DBManager.getConnectedConnectionAsync();
    expect(connection.isConnected).toBe(true);
    await DBManager.closeConnectionAsync();
  });
});