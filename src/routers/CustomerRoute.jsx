import React from 'react'
import { Navigate } from 'react-router-dom';

// Menú, Carrito y Mis Pedidos son para clientes: el admin ya tiene Pedido en Caja
// y Estado de Ordenes para gestionar todo, así que no tiene sentido mostrarle esto.
export const CustomerRoute = ({children}) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!currentUser) return <Navigate to="/login" replace/>;

    return currentUser.role !== 'ADMINISTRADOR' ? children : <Navigate to="/orders" replace/>;
}
