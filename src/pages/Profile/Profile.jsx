import { Modal, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import './Profile.scss';

const URL = process.env.REACT_APP_API_URL;
const ROLE_LABEL = { ADMINISTRADOR: 'Administrador', USUARIO: 'Usuario' };

export const Profile = () => {
  const auth = useAuth();
  const isAdmin = auth.user.role === 'ADMINISTRADOR';
  const [fullName, setFullName] = useState(auth.user.fullName || '');
  const [phone, setPhone] = useState(auth.user.phone || '');
  const [address, setAddress] = useState(auth.user.address || '');
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

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

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      Modal.error({ title: 'Contraseña muy corta', content: 'La nueva contraseña debe tener 8 o más caracteres' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Modal.error({ title: 'No coinciden', content: 'La confirmación no coincide con la nueva contraseña' });
      return;
    }
    setChangingPassword(true);
    try {
      await axios.put(
        `${URL}/user/me/password`,
        { currentPassword, newPassword },
        { headers: { authorization: auth.token } }
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Modal.success({ title: 'Contraseña actualizada', content: 'Tu contraseña se cambió correctamente' });
    } catch (error) {
      Modal.error({
        title: 'No se pudo cambiar la contraseña',
        content: error?.response?.data?.message || 'Revisá tu conexión e intentá nuevamente',
      });
    } finally {
      setChangingPassword(false);
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

        <form className="profile-form" onSubmit={changePassword}>
          <h2 className="profile-form-title">Cambiar contraseña</h2>

          <div className="cash-field">
            <label htmlFor="currentPassword">Contraseña actual</label>
            <input
              id="currentPassword"
              type="password"
              maxLength={30}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="cash-field">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              id="newPassword"
              type="password"
              maxLength={30}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="cash-field">
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              maxLength={30}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="cash-confirm-btn" disabled={changingPassword}>
            {changingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </form>

        <div className="profile-summary">
          <span className="profile-role-badge">{ROLE_LABEL[auth.user.role] || auth.user.role}</span>
          {!isAdmin && (
            <div className="profile-points">
              <span className="profile-points-label">Puntos acumulados</span>
              <span className="profile-points-value">{auth.user.points || 0}</span>
              <p>Cada $100 en pedidos completados suman 1 punto. Canjealos al pagar tu próximo pedido online: 1 punto = $10 de descuento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
