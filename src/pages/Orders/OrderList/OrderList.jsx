import { DownOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../auth/useAuth';
import './OrderList.scss'

const URL = process.env.REACT_APP_API_URL;

const STATUSES = ['pendiente', 'realizado'];
const STATUS_LABEL = { pendiente: 'Pendiente', realizado: 'Realizado' };
const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'realizado', label: 'Realizados' },
];

export const OrderList = () => {
  const [orders, updOrders] = useState([])
  const [expanded, setExpanded] = useState(() => new Set())
  const [filter, setFilter] = useState('todas')
  const auth = useAuth()

  const getOrders = async () => {
    try {
      const dataFromDB = await axios.get(`${URL}/orders`)
      const ordersDB = dataFromDB.data.ticket;
      const orderToRender = ordersDB.map(el => ({
        key: el._id,
        date: el.cretatedAt,
        user: el.user.fullName,
        menu: el.menu,
        state: el.state,
        total: el.total
      }))
      updOrders(orderToRender)
    } catch {
      console.log('No se pudo obtener ')
    }
  }

  const handleOrderStatus = async (id, state) => {
    const previous = orders;
    updOrders(prev => prev.map(o => o.key === id ? { ...o, state } : o));
    try {
      await axios.put(`${URL}/order/${id}`, { state }, {
        headers: { authorization: auth.token }
      })
    } catch {
      updOrders(previous);
    }
  }

  useEffect(() => {
    getOrders()
  }, []);

  const toggleExpanded = (key) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filteredOrders = filter === 'todas' ? orders : orders.filter(o => o.state === filter);

  return (
    <div className="orders-page">
      <Typography.Title level={1} className="orders-title">Pedidos</Typography.Title>

      <div className="status-filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            type="button"
            className={`status-filter-chip${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="orders-page-empty">No hay pedidos registrados todavía.</p>
      ) : filteredOrders.length === 0 ? (
        <p className="orders-page-empty">No hay pedidos con ese estado.</p>
      ) : (
        <ul className="order-list">
          {filteredOrders.map((order) => {
            const isOpen = expanded.has(order.key);
            return (
              <li className={`order-card order-card--${order.state}`} key={order.key}>
                <div className="order-card-header order-card-header--admin">
                  <button
                    type="button"
                    className="order-card-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleExpanded(order.key)}
                  >
                    <div className="order-card-date">
                      <span className="order-card-label">{order.user}</span>
                      <span>{order.date.slice(0, 10)}</span>
                    </div>
                    <span className="order-card-total">${order.total}</span>
                    <DownOutlined className="order-card-chevron" />
                  </button>

                  <div className="order-status-toggle" role="group" aria-label="Estado del pedido">
                    {STATUSES.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`order-status-option${order.state === s ? ' is-active' : ''}`}
                        onClick={() => handleOrderStatus(order.key, s)}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`order-card-body-wrap${isOpen ? ' is-open' : ''}`}>
                  <div className="order-card-body-inner">
                    <ul className="order-lines">
                      {order.menu.map((item, idx) => (
                        <li className="order-line" key={idx}>
                          <img className="order-line-img" src={item.IMG} alt={item.name} />
                          <div className="order-line-info">
                            <span className="order-line-name">{item.name}</span>
                            {item.note && <span className="order-line-note">{item.note}</span>}
                          </div>
                          <span className="order-line-qty">x{item.cantidad}</span>
                          <span className="order-line-subtotal">${item.price * item.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}
