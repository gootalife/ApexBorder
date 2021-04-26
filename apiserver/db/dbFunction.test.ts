import * as db from './dbFunction';
import config from '../config.json';

describe('dbFunctionTest', () => {
  test('fetchBordersAsyncTest', async () => {
    const result = await db.fetchBordersAsync();
    expect(result.length).toBe(Object.keys(config.platforms).length);
  });
  test('fetchRPRankingsAsyncTest', async () => {
    const result = await db.fetchRPRankingsAsync();
    expect(result.season).toBe(config.env.season);
    expect(result.origin.length).toBe(config.env.border);
    expect(result.ps.length).toBe(config.env.border);
    expect(result.xbox.length).toBe(config.env.border);
  }, 60000);
});
