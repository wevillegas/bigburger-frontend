import { Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import './Dashboard.scss';

const URL = process.env.REACT_APP_API_URL;

function startOfDay(daysAgo = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

export const Dashboard = () => {
  const auth = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await axios.get(`${URL}/orders`, { headers: { authorization: auth.token } });
        setOrders(data.ticket);
      } catch {
        // si falla, el dashboard queda en cero en vez de romper la página
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const today = startOfDay(0);
    const weekAgo = startOfDay(6);

    const isToday = (d) => new Date(d) >= today;
    const isThisWeek = (d) => new Date(d) >= weekAgo;

    const revenueToday = orders
      .filter((o) => o.state === 'realizado' && isToday(o.cretatedAt))
      .reduce((sum, o) => sum + o.total, 0);

    const revenueWeek = orders
      .filter((o) => o.state === 'realizado' && isThisWeek(o.cretatedAt))
      .reduce((sum, o) => sum + o.total, 0);

    const ordersToday = orders.filter((o) => isToday(o.cretatedAt)).length;
    const pendingCount = orders.filter((o) => o.state === 'pendiente').length;

    const channelCounts = { caja: 0, online: 0 };
    orders.forEach((o) => { channelCounts[o.channel || 'online'] += 1; });

    const productCounts = {};
    orders.forEach((o) => {
      (o.menu || []).forEach((item) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.cantidad;
      });
    });
    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const maxCount = topProducts[0]?.[1] || 1;

    return { revenueToday, revenueWeek, ordersToday, pendingCount, channelCounts, topProducts, maxCount };
  }, [orders]);

  return (
    <div className="dashboard-page">
      <Typography.Title level={1} className="stencil-title">Estadísticas</Typography.Title>

      {loading ? (
        <p className="dashboard-empty">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="dashboard-empty">Todavía no hay pedidos registrados.</p>
      ) : (
        <>
          <div className="dashboard-tiles">
            <div className="dashboard-tile">
              <span className="dashboard-tile-label">Recaudado hoy</span>
              <span className="dashboard-tile-value">${stats.revenueToday}</span>
            </div>
            <div className="dashboard-tile">
              <span className="dashboard-tile-label">Recaudado últimos 7 días</span>
              <span className="dashboard-tile-value">${stats.revenueWeek}</span>
            </div>
            <div className="dashboard-tile">
              <span className="dashboard-tile-label">Pedidos hoy</span>
              <span className="dashboard-tile-value">{stats.ordersToday}</span>
            </div>
            <div className="dashboard-tile">
              <span className="dashboard-tile-label">Pendientes</span>
              <span className="dashboard-tile-value">{stats.pendingCount}</span>
            </div>
          </div>

          <div className="dashboard-layout">
            <div className="dashboard-panel">
              <h2>Producto más pedido</h2>
              {stats.topProducts.length === 0 ? (
                <p className="dashboard-empty">Sin datos todavía.</p>
              ) : (
                <ul className="dashboard-bars">
                  {stats.topProducts.map(([name, count]) => (
                    <li key={name}>
                      <span className="dashboard-bar-label">{name}</span>
                      <div className="dashboard-bar-track">
                        <div className="dashboard-bar-fill" style={{ width: `${(count / stats.maxCount) * 100}%` }} />
                      </div>
                      <span className="dashboard-bar-count">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dashboard-panel">
              <h2>Pedidos por canal</h2>
              <div className="dashboard-channel-row">
                <span>En caja</span>
                <b>{stats.channelCounts.caja}</b>
              </div>
              <div className="dashboard-channel-row">
                <span>Por la app</span>
                <b>{stats.channelCounts.online}</b>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
