import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React from 'react'
import './userList.scss'

const ROLE_LABEL = { ADMINISTRADOR: 'Administrador', USUARIO: 'Usuario' };

export const ListaUsuarios = ({ functionDelete, handleActiveStatus, users, functionEditUser, pageSize }) => {

    if (users.length === 0) {
        return <p className="admin-empty">No hay usuarios que coincidan con la búsqueda.</p>
    }

    // rellena los lugares vacíos de la última página para que la lista siempre ocupe el mismo alto
    const emptySlots = Array.from({ length: Math.max(0, (pageSize || 0) - users.length) })

    return (
        <ul className="user-list">
            {users.map((user) => (
                <li className="user-card" key={user._id}>
                    <div className="user-card-avatar">{user.fullName?.[0]?.toUpperCase()}</div>

                    <div className="user-card-info">
                        <span className="user-card-name">{user.fullName}</span>
                        <span className="user-card-email">{user.email}</span>
                    </div>

                    <span className={`user-role-badge user-role-badge--${user.role}`}>
                        {ROLE_LABEL[user.role] || user.role}
                    </span>

                    <label className="user-active-toggle">
                        <input
                            type="checkbox"
                            checked={user.active}
                            onChange={(e) => handleActiveStatus(e.target.checked, 'active', user._id)}
                        />
                        {user.active ? 'Activo' : 'Inactivo'}
                    </label>

                    <div className="user-card-actions">
                        <button
                            type="button"
                            aria-label={`Editar ${user.fullName}`}
                            onClick={() => functionEditUser(user, user._id)}
                        >
                            <EditOutlined />
                        </button>
                        <button
                            type="button"
                            className="danger"
                            aria-label={`Eliminar ${user.fullName}`}
                            onClick={() => functionDelete(user._id)}
                        >
                            <DeleteOutlined />
                        </button>
                    </div>
                </li>
            ))}
            {emptySlots.map((_, i) => (
                <li className="user-card user-card-placeholder" key={`empty-${i}`} aria-hidden="true">
                    <div className="user-card-avatar">&nbsp;</div>
                    <div className="user-card-info">
                        <span className="user-card-name">&nbsp;</span>
                        <span className="user-card-email">&nbsp;</span>
                    </div>
                    <span className="user-role-badge">&nbsp;</span>
                    <label className="user-active-toggle">
                        <input type="checkbox" disabled tabIndex={-1} />
                        &nbsp;
                    </label>
                    <div className="user-card-actions">
                        <button type="button" tabIndex={-1}><EditOutlined /></button>
                        <button type="button" tabIndex={-1}><DeleteOutlined /></button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
