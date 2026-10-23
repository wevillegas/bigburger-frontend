import { API_URL } from '../../../config/env'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, CloseOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { readJSON } from '../../../utils/storage';
import { formatDateTime } from '../../../utils/date';
import { canCancel, confirmCancel, CANCEL_WINDOW_MINUTES } from '../../../utils/cancelOrder';
import './OrderList.scss'

const STATUS_LABEL = { pendiente: 'Preparando tu pedido', realizado: 'Listo', cancelado: 'Cancelado' };

// seguimiento de pedidos de invitado: los tokens viven en este navegador (ver Cart.jsx)
export const TrackOrder = () => {
  const [orders, setOrders] = useState([])

  const load = async () => {
    const tokens = readJSON('guestOrders') || []
    const results = await Promise.all(
      tokens.map(t => axios.get(`${API_URL}/order/track/${t}`).then(r => ({ ...r.data.order, token: t })).catch(() => null))
    )
    setOrders(results.filter(Boolean))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <ShoppingOutlined className="orders-empty-icon" />
        <h2>No hay pedidos para seguir</h2>
        <p>Cuando confirmes un pedido sin cuenta, vas a ver acá su estado.</p>
        <Link to="/" className="orders-empty-cta">Ver el menú</Link>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <Typography.Title level={1} className="orders-title">Seguimiento de tu pedido</Typography.Title>
      <ul className="order-list">
        {orders.map(order => (
          <li className={`order-card order-card--${order.state}`} key={order._id}>
            <div className="order-card-header">
              <div className="order-card-date">
                <span className="order-card-label">Pedido #{order._id.slice(-6).toUpperCase()}</span>
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
              <span className={`order-status order-status--${order.state}`}>
                {order.state === 'realizado' ? <CheckCircleOutlined /> : order.state === 'cancelado' ? <CloseCircleOutlined /> : <ClockCircleOutlined />}
                {STATUS_LABEL[order.state] || order.state}
              </span>
              <span className="order-card-total">${order.total}</span>
            </div>
            <div className="order-card-body-inner">
              <p className="order-delivery-info">
                {order.deliveryMethod === 'envio' ? `Envío a: ${order.deliveryAddress}` : 'Retiro en el local'}
              </p>
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
              {canCancel(order.state, order.createdAt) && (
                <button type="button" className="order-cancel-btn" onClick={() => confirmCancel(`${API_URL}/order/track/${order.token}/cancel`, load)}>
                  <CloseOutlined /> Cancelar pedido (hasta {CANCEL_WINDOW_MINUTES} min)
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
