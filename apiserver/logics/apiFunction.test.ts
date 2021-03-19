import * as api from './apiFunction';
import config from '../config.json';

describe('apiFunctionTest', () => {
  test('fetchCurrentBordersAsyncTest', async () => {
    const result = await api.getCurrentBordersAsync();
    expect(result.length).toBe(Object.keys(config.platforms).length);
  }, 20000);
  test.skip('getRPLogsBetweenAsyncTest', async () => {
    const result = await api.getRPLogsBetweenAsync('2021-03-01', '2021-03-05');
    expect(result.length).toBe(5);
  }, 20000);
  test.skip('getRPLogsOnSeasonAsyncTest', async () => {
    const result = await api.getRPLogsOnSeasonAsync('8sp1');
    expect(result.length).toBeGreaterThan(0);
  }, 20000);
});