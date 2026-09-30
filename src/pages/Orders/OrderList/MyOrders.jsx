import { CheckCircleOutlined, ClockCircleOutlined, DownOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth';
import './OrderList.scss'

const URL = process.env.REACT_APP_API_URL;

const STATUS_LABEL = { pendiente: 'Pendiente', realizado: 'Realizado' };
const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'realizado', label: 'Realizados' },
];

export const MyOrders = () => {
  const auth = useAuth()
  const [orders, updOrders] = useState([])
  const [expanded, setExpanded] = useState(() => new Set())
  const [filter, setFilter] = useState('todas')

  const getOrders = async () => {
    try {
      const dataFromDB = await axios.get(`${URL}/orders`)
      const ordersDB = dataFromDB.data.ticket;
      const orderFilter = ordersDB.filter(el => el.user._id == auth.user._id)
      const orderToRender = orderFilter.map(el => ({
        date: el.cretatedAt,
        key: el._id,
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

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <ShoppingOutlined className="orders-empty-icon" />
        <h2>Todavía no hiciste ningún pedido</h2>
        <p>Cuando confirmes una orden desde el carrito, la vas a ver acá.</p>
        <Link to="/" className="orders-empty-cta">Ver el menú</Link>
      </div>
    );
  }

  const filteredOrders = filter === 'todas' ? orders : orders.filter(o => o.state === filter);

  return (
    <div className="orders-page">
      <Typography.Title level={1} className="orders-title">Mis Pedidos</Typography.Title>

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

      {filteredOrders.length === 0 && (
        <p className="orders-page-empty">No hay pedidos con ese estado.</p>
      )}

      <ul className="order-list">
        {filteredOrders.map((order) => {
          const isOpen = expanded.has(order.key);
          return (
            <li className={`order-card order-card--${order.state}`} key={order.key}>
              <button
                type="button"
                className="order-card-header"
                aria-expanded={isOpen}
                onClick={() => toggleExpanded(order.key)}
              >
                <div className="order-card-date">
                  <span className="order-card-label">Pedido</span>
                  <span>{order.date.slice(0, 10)}</span>
                </div>

                <span className={`order-status order-status--${order.state}`}>
                  {order.state === 'realizado' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                  {STATUS_LABEL[order.state] || order.state}
                </span>

                <span className="order-card-total">${order.total}</span>

                <DownOutlined className="order-card-chevron" />
              </button>

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
    </div>
  )
}
