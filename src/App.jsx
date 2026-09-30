

import { Route, Routes } from "react-router-dom"
import { AuthProvider } from "./auth/AuthProvider";
import { Home } from "./pages/Home/Home"
import { Login } from "./pages/Login/Login"


export const App = () =>{

  return(
    <>


    <AuthProvider>
        <Routes>
          <Route exact path="/login" element={<Login/>}/>
          {/* Home decide caso por caso qué rutas son públicas (Menú/Carrito),
              de cliente logueado, o de admin — ya no todo exige sesión */}
          <Route path="/*" element={<Home />}/>
        </Routes>
      </AuthProvider>

    </>
  )
}
