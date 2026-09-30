import React from 'react'
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({children}) => {
    // sin sesión, localStorage no tiene "currentUser": evita el crash de leer .role de null
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!currentUser) return <Navigate to="/login" replace/>;

    return currentUser.role === 'ADMINISTRADOR' ? children : <Navigate to="/" replace/>;
}
