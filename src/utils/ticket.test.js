import { buildTicketText } from './ticket';

const baseOrder = {
  key: 'abcdef123456',
  date: '2026-01-15T10:30:00.000Z',
  channel: 'online',
  user: 'Juan Perez',
  isGuest: false,
  deliveryMethod: 'retiro',
  menu: [{ name: 'Doble Bacon', cantidad: 2, price: 100 }],
  total: 200,
  discount: 0,
  paymentMethod: null,
  pointsEarned: 0,
};

test('incluye el numero de pedido y el total', () => {
  const text = buildTicketText(baseOrder);
  expect(text).toContain('Pedido #123456');
  expect(text).toContain('$200');
});

test('muestra al invitado y su telefono cuando el pedido es de invitado', () => {
  const text = buildTicketText({ ...baseOrder, isGuest: true, guestPhone: '3815551234' });
  expect(text).toContain('(invitado)');
  expect(text).toContain('Teléfono: 3815551234');
});

test('muestra la direccion de envio en vez de "retiro en el local"', () => {
  const text = buildTicketText({ ...baseOrder, deliveryMethod: 'envio', deliveryAddress: 'Av. Siempre Viva 123' });
  expect(text).toContain('Envío a: Av. Siempre Viva 123');
  expect(text).not.toContain('Retiro en el local');
});

test('descuenta los puntos canjeados del total mostrado', () => {
  const text = buildTicketText({ ...baseOrder, discount: 50, total: 150 });
  expect(text).toContain('-$50');
  expect(text).toContain('$150');
});
