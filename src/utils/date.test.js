import { formatDateTime } from './date';

test('formatea fecha y hora en formato es-AR', () => {
  const result = formatDateTime('2026-03-05T14:30:00.000Z');
  expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  expect(result).toMatch(/\d{1,2}:\d{2}/);
});
