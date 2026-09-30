import React from 'react'
import { Navigate } from 'react-router-dom';

// Menú y Carrito: accesibles sin cuenta (invitado) o con cuenta de cliente.
// El admin no tiene nada que hacer acá, así que lo mandamos a su panel.
export const PublicOrCustomerRoute = ({children}) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (currentUser?.role === 'ADMINISTRADOR') return <Navigate to="/orders" replace/>;

    return children
}
