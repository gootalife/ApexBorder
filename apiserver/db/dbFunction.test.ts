import * as db from './dbFunction';
import config from '../config.json';

describe('dbFunctionTest', () => {
  test('fetchCurrentBordersAsyncTest', async () => {
    const result = await db.fetchCurrentBordersAsync();
    expect(result.length).toBe(Object.keys(config.platforms).length);
  });
  test.skip('fetchCurrentRPRankingsAsyncTest', async () => {
    const result = await db.fetchCurrentRPRankingsAsync();
    expect(result.season).toBe(config.env.season);
    expect(result.origin.length).toBe(config.env.border);
    expect(result.ps.length).toBe(config.env.border);
    expect(result.xbox.length).toBe(config.env.border);
  }, 60000);
});