import { readJSON } from '../utils/storage'
import React from 'react'
import { Navigate } from 'react-router-dom';

// cualquier usuario logueado, sin importar el rol (ej: Mi Perfil)
export const AuthRoute = ({children}) => {
    const currentUser = readJSON('currentUser')
    if (!currentUser) return <Navigate to="/login" replace/>;

    return children
}
