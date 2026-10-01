import { DownloadOutlined, DownOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../auth/useAuth';
import { Pagination } from '../../../shared/Pagination/Pagination';
import { downloadTicket } from '../../../utils/ticket';
import { formatDateTime } from '../../../utils/date';
import './OrderList.scss'

const URL = process.env.REACT_APP_API_URL;

const STATUSES = ['pendiente', 'realizado'];
const STATUS_LABEL = { pendiente: 'Pendiente', realizado: 'Realizado' };
const PAYMENT_LABEL = { efectivo: 'Efectivo', transferencia: 'Transferencia', tarjeta: 'Tarjeta' };
const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'realizado', label: 'Realizados' },
];
const CHANNEL_FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'caja', label: 'En caja' },
  { key: 'online', label: 'Por la app' },
  { key: 'invitado', label: 'Invitados' },
];
const PAGE_SIZE = 6

export const OrderList = () => {
  const [orders, updOrders] = useState([])
  const [expanded, setExpanded] = useState(() => new Set())
  const [filter, setFilter] = useState('todas')
  const [channelFilter, setChannelFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const auth = useAuth()

  const getOrders = async () => {
    try {
      const dataFromDB = await axios.get(`${URL}/orders`, {
        headers: { authorization: auth.token },
      })
      const ordersDB = dataFromDB.data.ticket;
      const orderToRender = ordersDB.map(el => ({
        key: el._id,
        date: el.cretatedAt,
        user: el.user.fullName,
        isGuest: !!el.user.guest,
        guestPhone: el.guestContact?.phone,
        menu: el.menu,
        state: el.state,
        total: el.total,
        channel: el.channel,
        customerLabel: el.customerLabel,
        paymentMethod: el.paymentMethod,
        deliveryMethod: el.deliveryMethod,
        deliveryAddress: el.deliveryAddress,
        discount: el.discount,
        pointsEarned: el.pointsEarned,
        linkedCustomerName: el.linkedCustomer?.fullName
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
    // evita que el admin tenga que refrescar la página a mano para ver pedidos nuevos
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

  const searchNorm = search.trim().toLowerCase()
  const filteredOrders = orders
    .filter(o => filter === 'todas' || o.state === filter)
    .filter(o => {
      if (channelFilter === 'todos') return true
      if (channelFilter === 'invitado') return o.isGuest
      return (o.channel || 'online') === channelFilter
    })
    .filter(o => {
      if (!searchNorm) return true
      const who = (o.channel === 'caja' ? o.customerLabel : o.user) || ''
      const when = formatDateTime(o.date)
      return who.toLowerCase().includes(searchNorm) || when.toLowerCase().includes(searchNorm)
    })
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  // rellena los lugares vacíos de la última página para que la lista siempre ocupe el mismo alto
  const emptySlots = Array.from({ length: PAGE_SIZE - pageOrders.length })

  const changeFilter = (key) => {
    setFilter(key)
    setPage(1)
  }

  const changeChannelFilter = (key) => {
    setChannelFilter(key)
    setPage(1)
  }

  const changeSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="orders-page">
      <Typography.Title level={1} className="orders-title">Pedidos</Typography.Title>

      <input
        type="text"
        className="orders-search"
        placeholder="Buscar por día, usuario o mesa..."
        value={search}
        onChange={(e) => changeSearch(e.target.value)}
        aria-label="Buscar pedidos por día, usuario o mesa"
      />

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

      <div className="status-filters">
        {CHANNEL_FILTERS.map(f => (
          <button
            key={f.key}
            type="button"
            className={`status-filter-chip${channelFilter === f.key ? ' active' : ''}`}
            onClick={() => changeChannelFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="orders-page-empty">No hay pedidos registrados todavía.</p>
      ) : filteredOrders.length === 0 ? (
        <p className="orders-page-empty">No hay pedidos que coincidan con la búsqueda.</p>
      ) : (
        <ul className="order-list">
          {pageOrders.map((order) => {
            const isOpen = expanded.has(order.key);
            return (
              <li className={`order-card order-card--${order.state}`} key={order.key}>
                <button
                  type="button"
                  className="order-card-toggle"
                  aria-expanded={isOpen}
                  onClick={() => toggleExpanded(order.key)}
                >
                  <div className="order-card-row order-card-row--name">
                    <span className="order-card-label">
                      {order.channel === 'caja' ? order.customerLabel : order.user}
                    </span>
                    {order.channel === 'caja' && <span className="order-card-channel-tag">Caja</span>}
                    {order.isGuest && <span className="order-card-channel-tag">Invitado</span>}
                    <DownOutlined className="order-card-chevron" />
                  </div>
                  <div className="order-card-row order-card-row--date">
                    <span className="order-card-datetime">{formatDateTime(order.date)}</span>
                  </div>
                </button>

                <div className="order-card-row order-card-row--actions">
                  <span className="order-card-total">${order.total}</span>

                  <div className="order-card-actions">
                    <button
                      type="button"
                      className="order-card-download"
                      aria-label={`Descargar ticket del pedido de ${order.channel === 'caja' ? order.customerLabel : order.user}`}
                      title="Descargar ticket"
                      onClick={() => downloadTicket(order)}
                    >
                      <DownloadOutlined />
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
                </div>

                <div className={`order-card-body-wrap${isOpen ? ' is-open' : ''}`}>
                  <div className="order-card-body-inner">
                    {order.channel === 'caja' && order.paymentMethod && (
                      <p className="order-delivery-info">Pago: {PAYMENT_LABEL[order.paymentMethod]}</p>
                    )}
                    {order.isGuest && order.guestPhone && (
                      <p className="order-delivery-info">Teléfono: {order.guestPhone}</p>
                    )}
                    {order.deliveryMethod === 'envio' && (
                      <p className="order-delivery-info">Envío a: {order.deliveryAddress}</p>
                    )}
                    {order.linkedCustomerName && (
                      <p className="order-delivery-info">Cliente vinculado: {order.linkedCustomerName} (suma puntos)</p>
                    )}
                    {order.discount > 0 && (
                      <p className="order-delivery-info">Descuento por puntos: -${order.discount}</p>
                    )}
                    {order.pointsEarned > 0 && (
                      <p className="order-delivery-info">Puntos otorgados: {order.pointsEarned}</p>
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
                  </div>
                </div>
              </li>
            );
          })}
          {emptySlots.map((_, i) => (
            <li className="order-card order-card-placeholder" key={`empty-${i}`} aria-hidden="true">
              <div className="order-card-toggle">
                <div className="order-card-row order-card-row--name">
                  <span className="order-card-label">&nbsp;</span>
                </div>
                <div className="order-card-row order-card-row--date">&nbsp;</div>
              </div>
              <div className="order-card-row order-card-row--actions">
                <span className="order-card-total">&nbsp;</span>
                <div className="order-card-actions">
                  <button type="button" className="order-card-download" tabIndex={-1}><DownloadOutlined /></button>
                  <div className="order-status-toggle" role="group">
                    {STATUSES.map((s) => (
                      <button type="button" key={s} className="order-status-option" tabIndex={-1}>
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
