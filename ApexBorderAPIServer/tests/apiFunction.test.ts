import * as api from '../logics/apiFunction'

test('getCurrentBordersAsync', async () => {
  const result = await api.getCurrentBordersAsync();
  expect(Object.keys(result.borders).length).toBe(Object.keys(api.platForms).length);
});

test('getRPLists', async () => {
  const result = await api.getRPLists();
});