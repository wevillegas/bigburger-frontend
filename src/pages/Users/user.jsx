import { API_URL } from '../../config/env'
import { Modal, Typography } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { EditUser } from './EditUser/EditUser'
import { ListaUsuarios } from './UserList/UserList'
import { Pagination } from '../../shared/Pagination/Pagination'

const ROLE_FILTERS = [
    { key: 'todos', label: 'Todos' },
    { key: 'ADMINISTRADOR', label: 'Administradores' },
    { key: 'USUARIO', label: 'Usuarios' },
];
const PAGE_SIZE = 8

export const User = () => {
    const [users, setUsers] = useState([]);
    const [actionDialog, toggleActionDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [roleFilter, setRoleFilter] = useState('todos');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);


    async function loadUsers() {
        const res = await axios.get(`${API_URL}/users`);
        const usersDB = res.data.users;
        setUsers(usersDB);
    }

    const handleDeleteUser = async (id) => {
        try {
            console.log(id)
            let userDE = users.find(user => user._id === id)
            const deletedUser = await axios.delete(`${API_URL}/user/${id}`)
            console.log(deletedUser)
            const u = users.filter(user => user._id !== id);
            setUsers(u)
            setDialogMessage(deletedUser.data.msg);
            setDialogTitle(`USUARIO: "${userDE.fullName}" ELIMINADO`)
            toggleActionDialog(true)
        }
        catch (error) {
            console.log(error)
            setDialogMessage('Error al borrar el usuario');
            setDialogTitle(`ERROR`)
            toggleActionDialog(true)
        }
    }

    //EDITAR ROL DE USUARIO
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null)
    const handleEditUser = async (user, id) => {
        try {
            const userEditing = users.find(user => user._id === id);
            setUserToEdit(userEditing)
            setIsModalVisible(true);
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleOk = () => {

        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setUserToEdit(null)
    };

    const updateRole = async (userUpdated) => {
        await axios.put(`${API_URL}/user/${userUpdated._id}`, userUpdated);
        // setIsModalVisible(false)
        loadUsers();
    }

    //EDITAR USUARIOS

    const handleActiveStatus = async (value, property, id) => {
        try {
            const user = users.find(user => user._id === id);
            user[property] = value;

            const updUser = await axios.put(`${API_URL}/user/${id}`, user)
            setUsers([...users])
            setDialogMessage(updUser.data.msg);
            if(user.active){
                setDialogTitle(`USUARIO: "${user.fullName}" ACTIVADO`)
                toggleActionDialog(true)
            } else { 
                setDialogTitle(`USUARIO: "${user.fullName}" DESACTIVADO`)
                setDialogMessage()
                toggleActionDialog(true)
            }
            
        } catch (error) {
            console.log(error)
            setDialogMessage(`Error al modificar el usuario`);
            setDialogTitle(`ERROR`)
            toggleActionDialog(true)
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const hiddeModal = () => toggleActionDialog(false)

    const filteredUsers = users.filter(u => {
        const matchesRole = roleFilter === 'todos' || u.role === roleFilter;
        const matchesSearch = u.fullName.toLowerCase().includes(search.trim().toLowerCase());
        return matchesRole && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const changeRoleFilter = (key) => {
        setRoleFilter(key);
        setPage(1);
    };

    const changeSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <>
            <Typography.Title level={1} className="stencil-title">Usuarios</Typography.Title>

            <div className="users-toolbar">
                <div className="role-filters">
                    {ROLE_FILTERS.map(f => (
                        <button
                            key={f.key}
                            type="button"
                            className={`filter-chip${roleFilter === f.key ? ' active' : ''}`}
                            onClick={() => changeRoleFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    className="user-search"
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => changeSearch(e.target.value)}
                    aria-label="Buscar usuario por nombre"
                />
            </div>

            <ListaUsuarios handleActiveStatus={handleActiveStatus} functionDelete={handleDeleteUser} users={pageUsers} functionEditUser={handleEditUser} pageSize={PAGE_SIZE} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            <Modal title={dialogTitle} visible={actionDialog} onOk={hiddeModal} onCancel={hiddeModal}>
                {dialogMessage}
            </Modal>
            <Modal title="Editar usuario" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} handleEditUser={handleEditUser} >
                <EditUser userToEdit={userToEdit} updateRole={updateRole}></EditUser>

            </Modal>
        </>
    )

}