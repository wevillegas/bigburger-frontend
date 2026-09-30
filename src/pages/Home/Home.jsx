import { Drawer, Layout } from "antd";


import React, { useEffect, useState } from "react";
import axios from "axios";

import { Route, Routes } from "react-router-dom";
import { AdminRoute } from "../../routers/AdminRoute";
import { CustomerRoute } from "../../routers/CustomerRoute";
import { PublicOrCustomerRoute } from "../../routers/PublicOrCustomerRoute";
import { AuthRoute } from "../../routers/AuthRoute";
import { Footer } from "../../shared/Footer/Footer";
import { Header } from "../../shared/Header/Header";
import { Sidebar } from "../../shared/Sidebar/Sidebar";
import { DriftingBackground } from "../../shared/Background/DriftingBackground";
import { Cart } from "../Orders/Cart";
import { OrderList } from "../Orders/OrderList/OrderList";
import { Products } from "../Products/Products";
import { ProductHome } from "../Products/ProductsList/ProductHome";
import { User } from "../Users/user";
import { useAuth } from "../../auth/useAuth";

import { MyOrders } from "../Orders/OrderList/MyOrders";
import { CashOrder } from "../Orders/CashOrder/CashOrder";
import { Profile } from "../Profile/Profile";
import { Dashboard } from "../Dashboard/Dashboard";
import "./Home.scss";
import { Error } from "../Error/Error";

const URL = process.env.REACT_APP_API_URL;
const { Content, Sider } = Layout;
export const Home = () => {
  const auth = useAuth();
  const initialCart = JSON.parse(localStorage.getItem('inCart'))
  const [productsQty, setProductQty] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const bCount = (cart) => {

    const burgerCount = cart?.reduce(
      (counter, itemQty) => counter + itemQty.cantidad,
      0
    );
    setProductQty(burgerCount);
  };
  useEffect(()=>{
    bCount(initialCart)},[]
  )

  // marca en el sidebar si el usuario tiene un pedido en curso, sin esperar a que refresque la página
  useEffect(() => {
    if (!auth.user || !auth.token) return;

    const loadPendingOrders = async () => {
      try {
        const { data } = await axios.get(`${URL}/orders`, {
          headers: { authorization: auth.token },
        });
        const ownPending = data.ticket.filter(
          (o) => o.user._id === auth.user._id && o.state === "pendiente"
        );
        setPendingOrders(ownPending.length);
      } catch {
        // silencioso: no bloquea la navegación por un pedido en curso que no se pudo consultar
      }
    };

    loadPendingOrders();
    const interval = setInterval(loadPendingOrders, 15000);
    return () => clearInterval(interval);
  }, [auth.user, auth.token])
  return (
    <>
      <DriftingBackground />
      <Layout style={{ minHeight: "100vh" }}>
        <Header productsQty={productsQty} onMenuClick={() => setMenuOpen((o) => !o)} />
        <Layout className="fullHeight">
          <Sider className="desktopSider" breakpoint="lg" collapsedWidth="60px" style={{}}>
            <Sidebar productsQty={productsQty} pendingOrders={pendingOrders} />
          </Sider>
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setMenuOpen(false)}
            visible={menuOpen}
            className="mobileDrawer"
            bodyStyle={{ padding: 0, backgroundColor: 'var(--color1)' }}
            width={240}
          >
            <Sidebar productsQty={productsQty} pendingOrders={pendingOrders} onNavigate={() => setMenuOpen(false)} />
          </Drawer>

            <Content
              className="site-layout-background" 
              breakpoint="lg" 
              style={{
                padding: 24,
                margin: 0,
                width:'100%'
              }}
            >
              <Routes>
                <Route path="/*" element={<Error />} />
                <Route
                  path="/"
                  element={
                    <PublicOrCustomerRoute>
                      <ProductHome bCount={(b)=>bCount(b)} />
                    </PublicOrCustomerRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PublicOrCustomerRoute>
                      <Cart bCount={(b)=>bCount(b)} />
                    </PublicOrCustomerRoute>
                  }
                />
                <Route
                  path="/myorder"
                  element={
                    <CustomerRoute>
                      <MyOrders bCount={(b)=>bCount(b)} />
                    </CustomerRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <AuthRoute>
                      <Profile />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <AdminRoute>
                      <Products />
                    </AdminRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <AdminRoute>
                      <OrderList />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/caja"
                  element={
                    <AdminRoute>
                      <CashOrder />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <AdminRoute>
                      <User />
                    </AdminRoute>
                  }
                />
              </Routes>
            </Content>
          
        </Layout>
        <Footer />

      </Layout>
    </>
  );
};
