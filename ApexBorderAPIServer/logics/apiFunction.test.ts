import * as api from './apiFunction';
import config from '../config.json';

describe('apiFunctionTest', () => {
  test.skip('getCurrentBordersAsyncTest', async () => {
    const result = await api.getCurrentBordersAsync();
    expect(Object.keys(result.borders).length).toBe(Object.keys(config.platforms).length);
  }, 20000);
  test.skip('getRPLogsBetweenAsyncTest', async () => {
    const result = await api.getRPLogsBetweenAsync('2021-03-01', '2021-03-05');
    expect(result.length).toBe(5);
  }, 20000);
  test.skip('getRPLogsOnSeasonAsyncTest', async () => {
    const result = await api.getRPLogsOnSeasonAsync('8sp1');
    expect(result.length).toBeGreaterThan(0);
  }, 20000);
  test('getCurrentRPRankingsAsyncTest', async () => {
    const result = await api.getCurrentRPRankingsAsync();
    expect(result.season).toBe(config.env.season);
    expect(result.origin.length).toBe(config.env.border);
    expect(result.ps.length).toBe(config.env.border);
    expect(result.xbox.length).toBe(config.env.border);
  }, 180000);
});