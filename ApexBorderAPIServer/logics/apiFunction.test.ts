import * as api from './apiFunction';

describe('apiFunctionTest', () => {
  test.concurrent('getCurrentBordersAsyncTest', async () => {
    const result = await api.getCurrentBordersAsync();
    expect(Object.keys(result.borders).length).toBe(Object.keys(api.platForms).length);
  }, 20000);
  test.concurrent('getRPLogsBetweenAsyncTest', async () => {
    const result = await api.getRPLogsBetweenAsync('2021-03-01', '2021-03-31', '8sp1');
    expect(result.length).toBe(7);
  });
  test.concurrent('getRPLogsOnSeasonAsyncTest', async () => {
    const result = await api.getRPLogsOnSeasonAsync('8sp1');
    expect(result.length).toBe(15);
  });
});