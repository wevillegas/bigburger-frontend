import { DeleteOutlined, MinusOutlined, PlusOutlined, PrinterOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/useAuth';
import { PRODUCT_CATEGORIES } from '../../../constants/categories';
import { formatDateTime } from '../../../utils/date';
import './CashOrder.scss';

const URL = process.env.REACT_APP_API_URL;
const CATEGORIES = ['Todas', ...PRODUCT_CATEGORIES];
const PAYMENT_METHODS = [
  { key: 'efectivo', label: 'Efectivo' },
  { key: 'transferencia', label: 'Transferencia' },
  { key: 'tarjeta', label: 'Tarjeta' },
];
const PAYMENT_LABEL = { efectivo: 'Efectivo', transferencia: 'Transferencia', tarjeta: 'Tarjeta' };

export const CashOrder = () => {
  const auth = useAuth();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [customerLabel, setCustomerLabel] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [linkedCustomer, setLinkedCustomer] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get(`${URL}/products`);
        setProducts(data.products.filter((p) => p.stock));
      } catch {
        Modal.error({ title: 'Error', content: 'No se pudieron cargar los productos' });
      }
    };
    loadProducts();
  }, []);

  // para poder vincular el pedido a una cuenta real y que sume puntos
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data } = await axios.get(`${URL}/users`, { headers: { authorization: auth.token } });
        setCustomers(data.users.filter((u) => u.role === 'USUARIO'));
      } catch {
        // si falla, el pedido igual se puede cargar sin vincular cuenta
      }
    };
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customerMatches = useMemo(() => {
    const term = customerSearch.trim().toLowerCase();
    if (!term) return [];
    return customers
      .filter((c) => c.fullName.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
      .slice(0, 6);
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => category === 'Todas' || p.categorie_id === category)
      .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));
  }, [products, category, search]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) => (i._id === product._id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, IMG: product.IMG, cantidad: 1, note: '' }];
    });
  };

  const changeQuantity = (id, value) => {
    if (value < 1) return;
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, cantidad: value } : i)));
  };

  const changeNote = (id, note) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, note } : i)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.cantidad, 0);

  const submitOrder = async () => {
    if (items.length === 0) return;
    if (!customerLabel.trim()) {
      Modal.error({ title: 'Falta un dato', content: 'Indicá para quién o para qué mesa es el pedido' });
      return;
    }
    if (!paymentMethod) {
      Modal.error({ title: 'Falta un dato', content: 'Seleccioná el método de pago' });
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${URL}/order`,
        {
          channel: 'caja',
          customerLabel: customerLabel.trim(),
          paymentMethod,
          menu: items,
          linkedCustomerId: linkedCustomer?._id,
        },
        { headers: { authorization: auth.token } }
      );
      setLastOrder(data.newOrder);
      setItems([]);
      setCustomerLabel('');
      setPaymentMethod('');
      setLinkedCustomer(null);
      setCustomerSearch('');
    } catch (error) {
      Modal.error({
        title: 'No se pudo cargar el pedido',
        content: error?.response?.data?.message || 'Revisá tu conexión e intentá nuevamente',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startNewOrder = () => setLastOrder(null);
  const printTicket = () => window.print();

  if (lastOrder) {
    return (
      <div className="cash-order-page">
        <Typography.Title level={1} className="stencil-title">Pedido en Caja</Typography.Title>

        <div className="cash-confirmation">
          <p className="cash-confirmation-msg">Pedido cargado correctamente. Total a cobrar: <b>${lastOrder.total}</b></p>
          <div className="cash-confirmation-actions">
            <button type="button" className="cash-print-btn" onClick={printTicket}>
              <PrinterOutlined /> Imprimir ticket
            </button>
            <button type="button" className="cash-new-btn" onClick={startNewOrder}>Nuevo pedido</button>
          </div>
        </div>

        <div className="cash-ticket">
          <div className="cash-ticket-header">
            <span className="cash-ticket-brand">BIGBURGER</span>
            <span>Av. Aconquija 1336, Yerba Buena, Tucumán</span>
            <span>Tel: 3815480041 / 3814029984</span>
          </div>
          <div className="cash-ticket-meta">
            <span>Pedido #{lastOrder._id.slice(-6).toUpperCase()}</span>
            <span>{formatDateTime(lastOrder.cretatedAt)}</span>
            <span>Para: {lastOrder.customerLabel}</span>
            <span>Atendido por: {auth.user.fullName}</span>
            {lastOrder.linkedCustomer && <span>Cliente: {lastOrder.linkedCustomer.fullName} (suma puntos)</span>}
          </div>
          <ul className="cash-ticket-lines">
            {lastOrder.menu.map((item, idx) => (
              <li key={idx}>
                <span className="cash-ticket-line-qty">{item.cantidad}x</span>
                <span className="cash-ticket-line-name">
                  {item.name}
                  {item.note && <em> ({item.note})</em>}
                </span>
                <span className="cash-ticket-line-price">${item.price * item.cantidad}</span>
              </li>
            ))}
          </ul>
          <div className="cash-ticket-total">
            <span>Total</span>
            <span>${lastOrder.total}</span>
          </div>
          <div className="cash-ticket-payment">Pago: {PAYMENT_LABEL[lastOrder.paymentMethod]}</div>
          <div className="cash-ticket-footer">¡Gracias por su compra!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cash-order-page">
      <Typography.Title level={1} className="stencil-title">Pedido en Caja</Typography.Title>
      <p className="cash-subtitle">Cargá el pedido de un cliente en el mostrador o de una mesa.</p>

      <div className="cash-order-layout">
        <div className="cash-picker">
          <input
            type="text"
            className="cash-search"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar producto"
          />
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-chip${category === cat ? ' active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <p className="cash-picker-empty">No hay productos que coincidan.</p>
          ) : (
            <ul className="cash-picker-grid">
              {filteredProducts.map((p) => (
                <li key={p._id} className="cash-picker-item">
                  <button type="button" onClick={() => addItem(p)}>
                    <img src={p.IMG} alt={p.name} />
                    <span className="cash-picker-item-name">{p.name}</span>
                    <span className="cash-picker-item-price">${p.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cash-summary">
          <h2>Pedido actual</h2>
          {items.length === 0 ? (
            <p className="cash-summary-empty">Agregá productos desde la izquierda.</p>
          ) : (
            <ul className="cash-summary-items">
              {items.map((item) => (
                <li key={item._id} className="cash-summary-item">
                  <img src={item.IMG} alt={item.name} />
                  <div className="cash-summary-item-info">
                    <span>{item.name}</span>
                    <input
                      type="text"
                      placeholder="Aclaración"
                      maxLength={120}
                      value={item.note}
                      onChange={(e) => changeNote(item._id, e.target.value)}
                      aria-label={`Aclaración para ${item.name}`}
                    />
                  </div>
                  <div className="cash-summary-stepper">
                    <button type="button" disabled={item.cantidad <= 1} onClick={() => changeQuantity(item._id, item.cantidad - 1)} aria-label={`Restar unidad de ${item.name}`}>
                      <MinusOutlined />
                    </button>
                    <span>{item.cantidad}</span>
                    <button type="button" onClick={() => changeQuantity(item._id, item.cantidad + 1)} aria-label={`Sumar unidad de ${item.name}`}>
                      <PlusOutlined />
                    </button>
                  </div>
                  <span className="cash-summary-item-subtotal">${item.price * item.cantidad}</span>
                  <button type="button" className="cash-summary-item-remove" onClick={() => removeItem(item._id)} aria-label={`Quitar ${item.name}`}>
                    <DeleteOutlined />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="cash-field">
            <label htmlFor="customerLabel">Para (nombre o mesa)</label>
            <input
              id="customerLabel"
              type="text"
              placeholder="Ej: Mesa 4 / Juan Pérez"
              maxLength={60}
              value={customerLabel}
              onChange={(e) => setCustomerLabel(e.target.value)}
            />
          </div>

          <div className="cash-field cash-customer-link">
            <label htmlFor="customerSearch">Cliente registrado (opcional, para sumar puntos)</label>
            {linkedCustomer ? (
              <div className="cash-customer-chip">
                <span>{linkedCustomer.fullName} ({linkedCustomer.email})</span>
                <button type="button" onClick={() => setLinkedCustomer(null)} aria-label="Quitar cliente vinculado">×</button>
              </div>
            ) : (
              <>
                <input
                  id="customerSearch"
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                {customerMatches.length > 0 && (
                  <ul className="cash-customer-matches">
                    {customerMatches.map((c) => (
                      <li key={c._id}>
                        <button
                          type="button"
                          onClick={() => {
                            setLinkedCustomer(c);
                            setCustomerSearch('');
                          }}
                        >
                          {c.fullName} <span>{c.email}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <div className="cash-field">
            <label>Método de pago</label>
            <div className="payment-method-options">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`filter-chip${paymentMethod === m.key ? ' active' : ''}`}
                  onClick={() => setPaymentMethod(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="cash-total">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <button type="button" className="cash-confirm-btn" disabled={submitting || items.length === 0} onClick={submitOrder}>
            {submitting ? 'Cargando...' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};
