import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from '../../auth/AuthProvider';
import { Cart } from './Cart';

jest.mock('axios');

const cartItem = { _id: 'p1', name: 'Doble Bacon', IMG: 'doble.png', price: 100, cantidad: 2, note: '' };

function renderCart() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Cart bCount={() => {}} />
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('inCart', JSON.stringify([cartItem]));
  axios.get.mockResolvedValue({ data: { products: [{ _id: 'p1', name: 'Doble Bacon', price: 100, stock: true }] } });
});

test('muestra el subtotal calculado a partir de los items del carrito', async () => {
  renderCart();
  const subtotalRow = await screen.findByText('Subtotal');
  expect(subtotalRow.parentElement).toHaveTextContent('$200');
});

test('un invitado debe completar nombre y telefono antes de poder confirmar el pedido', async () => {
  renderCart();
  const confirmBtn = await screen.findByRole('button', { name: /confirmar pedido/i });

  fireEvent.click(confirmBtn);

  await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
});

test('un invitado con nombre y telefono envia el pedido con esos datos', async () => {
  axios.post.mockResolvedValue({ data: { newOrder: { total: 200, pointsRedeemed: 0 } } });
  renderCart();

  fireEvent.change(await screen.findByLabelText('Tu nombre'), { target: { value: 'Juan Invitado' } });
  fireEvent.change(screen.getByLabelText('Tu teléfono'), { target: { value: '3815551234' } });
  fireEvent.click(screen.getByRole('button', { name: /confirmar pedido/i }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  const [, payload] = axios.post.mock.calls[0];
  expect(payload.guestName).toBe('Juan Invitado');
  expect(payload.guestPhone).toBe('3815551234');
  expect(payload.menu).toHaveLength(1);
});
