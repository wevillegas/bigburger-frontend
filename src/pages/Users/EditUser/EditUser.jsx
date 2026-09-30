import { Select } from 'antd'
import React from 'react'
import './EditUser.scss'

const { Option } = Select;
const ROLE_LABEL = { ADMINISTRADOR: 'Administrador', USUARIO: 'Usuario' };

export const EditUser = ({ userToEdit, updateRole }) => {

    function handleChange(event) {
        const user = userToEdit;
        user.role = event;
        updateRole(user)
    }

    return (
        <div className="editUserForm">
            <p className="editUserName">{userToEdit.fullName}</p>

            <div className="editUserCurrentRole">
                <span>Rol actual</span>
                <span className={`user-role-badge user-role-badge--${userToEdit.role}`}>
                    {ROLE_LABEL[userToEdit.role] || userToEdit.role}
                </span>
            </div>

            <label className="editUserLabel" htmlFor="roleSelect">Nuevo rol</label>
            <Select id="roleSelect" style={{ width: '100%' }} onChange={handleChange} value={userToEdit.role}>
                <Option value="USUARIO">Usuario</Option>
                <Option value="ADMINISTRADOR">Administrador</Option>
            </Select>
        </div>
    )
}
