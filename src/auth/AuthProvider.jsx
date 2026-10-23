import { API_URL } from '../config/env'
import { readJSON } from '../utils/storage'
import axios from "axios";
import { message } from "antd";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {


    const [user, setUser] = useState(readJSON('currentUser'));


    const navigate = useNavigate();
    // const [loginError, showLoginError] = useState(false)
    // const [errorMsg, setErrorMsg] = useState('')
    async function login(userLogin) {
        try {
            
            const login = await axios.post(`${API_URL}/login`, userLogin);
            // la sesión vive en una cookie HttpOnly que setea el backend: el JS nunca ve ni guarda el token
            setUser(login.data.user)
            navigate('/');
        } catch (error) {
            const data = error.response?.data
            message.error(data?.msg || data?.message || 'No pudimos iniciar sesión. Revisá tu conexión e intentá de nuevo')
            

        }
    }
    const logout = ()=> {
        // el backend borra la cookie de sesión (el front no puede: es HttpOnly)
        axios.post(`${API_URL}/logout`).catch(() => {})
        localStorage.removeItem('currentUser');
        localStorage.removeItem('inCart');
        setUser(null);
        navigate('/login')
    }

    useEffect(()=> {
        localStorage.removeItem('userToken'); // versiones anteriores guardaban el token acá (expuesto a XSS)
        setUser(readJSON('currentUser'));
    }, [])

    // si el token expiró o es inválido, el backend responde 401/403: cerramos sesión en vez de dejar la UI rota
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if ((error.response?.status === 401 || error.response?.status === 403) && readJSON('currentUser')) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=> {
        localStorage.setItem("currentUser", JSON.stringify(user))
    }, [user]);

    // refresca el usuario en memoria (y localStorage vía el efecto de arriba) sin pedir un nuevo login,
    // por ejemplo después de editar el perfil o canjear puntos
    const updateUser = (partial) => {
        setUser(prev => prev ? { ...prev, ...partial } : prev);
    }

    const auth = {
        user,
        login,
        logout,
        updateUser
    }
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}