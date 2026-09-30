import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { URL } from "../constants/endpoints";
const URL = process.env.REACT_APP_API_URL;
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {


    const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('userToken'))||[]);


    const navigate = useNavigate();
    // const [loginError, showLoginError] = useState(false)
    // const [errorMsg, setErrorMsg] = useState('')
    async function login(userLogin) {
        try {
            
            const login = await axios.post(`${URL}/login`, userLogin);
            localStorage.setItem('userToken', JSON.stringify(login.data.token));
            setToken(login.data.token)
            setUser(login.data.user)
            navigate('/');
        } catch (error) {
            console.log("Login fallido",error)
            

        }
    }
    const logout = ()=> {
        console.log('logout')
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('inCart');
        setUser(null);
        navigate('/login')
    }

    useEffect(()=> {
        setUser(JSON.parse(localStorage.getItem("currentUser")));
    }, [])

    // si el token expiró o es inválido, el backend responde 401/403: cerramos sesión en vez de dejar la UI rota
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if ((error.response?.status === 401 || error.response?.status === 403) && localStorage.getItem('userToken')) {
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
        updateUser,
        token
    }
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}