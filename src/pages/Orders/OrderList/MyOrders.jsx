import { CheckCircleOutlined, ClockCircleOutlined, DownOutlined, RedoOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth';
import { Pagination } from '../../../shared/Pagination/Pagination';
import { formatDateTime } from '../../../utils/date';
import './OrderList.scss'

const URL = process.env.REACT_APP_API_URL;

const STATUS_LABEL = { pendiente: 'Pendiente', realizado: 'Realizado' };
const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'realizado', label: 'Realizados' },
];
const PAGE_SIZE = 6

export const MyOrders = ({ bCount }) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [orders, updOrders] = useState([])
  const [expanded, setExpanded] = useState(() => new Set())
  const [filter, setFilter] = useState('todas')
  const [page, setPage] = useState(1)

  const getOrders = async () => {
    try {
      const dataFromDB = await axios.get(`${URL}/orders`, {
        headers: { authorization: auth.token },
      })
      const ordersDB = dataFromDB.data.ticket;
      // los pedidos cargados por un admin desde caja no son "sus" pedidos personales
      const orderFilter = ordersDB.filter(el => el.user._id == auth.user._id && el.channel !== 'caja')
      const orderToRender = orderFilter.map(el => ({
        date: el.cretatedAt,
        key: el._id,
        user: el.user.fullName,
        menu: el.menu,
        state: el.state,
        total: el.total,
        deliveryMethod: el.deliveryMethod,
        deliveryAddress: el.deliveryAddress,
        discount: el.discount,
        pointsRedeemed: el.pointsRedeemed,
        pointsEarned: el.pointsEarned
      }))
      updOrders(orderToRender)
    } catch {
      console.log('No se pudo obtener ')
    }
  }

  // vuelve a poner los mismos productos en el carrito para pedir de nuevo sin recorrer el menú
  const reorder = (order) => {
    const cartItems = order.menu.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      IMG: item.IMG,
      cantidad: item.cantidad,
      note: item.note || ''
    }))
    localStorage.setItem('inCart', JSON.stringify(cartItems))
    bCount?.(cartItems)
    navigate('/cart')
  }

  useEffect(() => {
    getOrders()
    // evita que el cliente tenga que refrescar la página a mano para ver el estado actualizado
    const interval = setInterval(getOrders, 15000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  // rellena los lugares vacíos de la última página para que la lista siempre ocupe el mismo alto
  const emptySlots = Array.from({ length: PAGE_SIZE - pageOrders.length })

  const changeFilter = (key) => {
    setFilter(key)
    setPage(1)
  }

  return (
    <div className="orders-page">
      <Typography.Title level={1} className="orders-title">Mis Pedidos</Typography.Title>

      <div className="status-filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            type="button"
            className={`status-filter-chip${filter === f.key ? ' active' : ''}`}
            onClick={() => changeFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="orders-page-empty">No hay pedidos con ese estado.</p>
      )}

      <ul className="order-list">
        {pageOrders.map((order) => {
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
                  <span>{formatDateTime(order.date)}</span>
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
                  {order.deliveryMethod === 'envio' && (
                    <p className="order-delivery-info">Envío a: {order.deliveryAddress}</p>
                  )}
                  {order.discount > 0 && (
                    <p className="order-delivery-info">Usaste {order.pointsRedeemed} puntos (-${order.discount})</p>
                  )}
                  {order.pointsEarned > 0 && (
                    <p className="order-delivery-info">Ganaste {order.pointsEarned} puntos con este pedido</p>
                  )}
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
                  <button type="button" className="order-reorder-btn" onClick={() => reorder(order)}>
                    <RedoOutlined /> Pedir de nuevo
                  </button>
                </div>
              </div>
            </li>
          );
        })}
        {emptySlots.map((_, i) => (
          <li className="order-card order-card-placeholder" key={`empty-${i}`} aria-hidden="true">
            <div className="order-card-header">
              <div className="order-card-date">
                <span className="order-card-label">&nbsp;</span>
                <span>&nbsp;</span>
              </div>
              <span className="order-status">&nbsp;</span>
              <span className="order-card-total">&nbsp;</span>
            </div>
          </li>
        ))}
      </ul>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
