import { Modal, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import './Profile.scss';

const URL = process.env.REACT_APP_API_URL;
const ROLE_LABEL = { ADMINISTRADOR: 'Administrador', USUARIO: 'Usuario' };

export const Profile = () => {
  const auth = useAuth();
  const [fullName, setFullName] = useState(auth.user.fullName || '');
  const [phone, setPhone] = useState(auth.user.phone || '');
  const [address, setAddress] = useState(auth.user.address || '');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${URL}/user/me`,
        { fullName: fullName.trim(), phone: phone.trim(), address: address.trim() },
        { headers: { authorization: auth.token } }
      );
      auth.updateUser({ fullName: data.fullName, phone: data.phone, address: data.address });
      Modal.success({ title: 'Perfil actualizado', content: 'Tus datos se guardaron correctamente' });
    } catch (error) {
      Modal.error({
        title: 'No se pudo guardar',
        content: error?.response?.data?.message || 'Revisá tu conexión e intentá nuevamente',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <Typography.Title level={1} className="stencil-title">Mi Perfil</Typography.Title>

      <div className="profile-layout">
        <form className="profile-form" onSubmit={save}>
          <div className="cash-field">
            <label htmlFor="fullName">Nombre completo</label>
            <input id="fullName" type="text" maxLength={40} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="cash-field">
            <label>Email</label>
            <input type="email" value={auth.user.email} disabled />
          </div>

          <div className="cash-field">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              maxLength={20}
              placeholder="Ej: 3815551234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="cash-field">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              type="text"
              maxLength={120}
              placeholder="Para envíos a domicilio"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button type="submit" className="cash-confirm-btn" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        <div className="profile-summary">
          <span className="profile-role-badge">{ROLE_LABEL[auth.user.role] || auth.user.role}</span>
          <div className="profile-points">
            <span className="profile-points-label">Puntos acumulados</span>
            <span className="profile-points-value">{auth.user.points || 0}</span>
            <p>Cada $100 en pedidos completados suman 1 punto. Canjealos al pagar tu próximo pedido online: 1 punto = $10 de descuento.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
