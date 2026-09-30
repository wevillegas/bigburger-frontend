import React, { useEffect, useState } from "react";
import {
  HomeOutlined,
  LogoutOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  SettingOutlined,
  UserSwitchOutlined,
  UserOutlined,
  PrinterOutlined,
  BarChartOutlined,

  ShoppingOutlined,

} from "@ant-design/icons";

import { Badge, Menu, Switch, Tooltip } from "antd";
import { useAuth } from "../../auth/useAuth";
import "./Sidebar.scss";
import { Link, NavLink, Router, useLocation } from "react-router-dom";

export const Sidebar = ({productsQty, pendingOrders, onNavigate}) => {

  const auth = useAuth();
  const userLogout = () => {
    auth.logout();
  };
  // sin sesión (invitado), localStorage no tiene "currentUser": nada de esto debe asumir que existe
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const adminRole = currentUser?.role === "ADMINISTRADOR";
  const isGuest = !currentUser;

  const location = useLocation();
  const pathToKey = {
    "/": "1",
    "/cart": "2",
    "/myorder": "7",
    "/orders": "3",
    "/users": "4",
    "/products": "5",
    "/caja": "8",
    "/perfil": "9",
    "/dashboard": "11",
  };
  const selectedKey = pathToKey[location.pathname] || "";

  return (
    <>


      <Menu theme="dark" mode="inline" className="sider" selectedKeys={[selectedKey]} onClick={() => onNavigate?.()}>
        <Menu.Item key="1" icon={<HomeOutlined />} hidden={adminRole}>
          <NavLink to="/">Menú</NavLink>
        </Menu.Item>
        <Menu.Item key="2" icon={<ShoppingCartOutlined />} className="cart" hidden={adminRole}>
          <NavLink to="/cart">
            <Badge count={productsQty} size="small">
              Carrito
            </Badge>
          </NavLink>
        </Menu.Item>

        <Menu.Item key="7" icon={<ShoppingOutlined />} className="cart" hidden={adminRole || isGuest}>
          <NavLink to="/myorder">
            <Badge count={pendingOrders} size="small" title="Pedido en curso">
              Ordenes
            </Badge>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="8" icon={<PrinterOutlined />} hidden={!adminRole}>
          <NavLink to="/caja">Pedido en Caja</NavLink>
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />} hidden={!adminRole}>
          <NavLink to="/orders">Estado de Ordenes</NavLink>
        </Menu.Item>
        <Menu.Item key="11" icon={<BarChartOutlined />} hidden={!adminRole}>
          <NavLink to="/dashboard">Estadísticas</NavLink>
        </Menu.Item>
        <Menu.Item key="4" icon={<UserSwitchOutlined />} hidden={!adminRole}>
          <NavLink to="/users">Editar Usuarios</NavLink>
        </Menu.Item>
        <Menu.Item key="5" icon={<EditOutlined />} hidden={!adminRole}>
          <NavLink to="/products">Editar Productos</NavLink>
        </Menu.Item>

        <Menu.Item key="9" icon={<UserOutlined />} hidden={isGuest}>
          <NavLink to="/perfil">Mi Perfil</NavLink>
        </Menu.Item>

        {isGuest ? (
          <Menu.Item key="10" icon={<LoginOutlined />}>
            <NavLink to="/login">Iniciar Sesión</NavLink>
          </Menu.Item>
        ) : (
          <Menu.Item
            key="6"
            icon={
              <div className="welcome-container">
                <div className="welcomeText">{currentUser.fullName[0]}</div>
              </div>
            }
            onClick={() => userLogout()}
          >
            Cerrar Sesión
          </Menu.Item>
        )}
      </Menu>

    </>
  );
};
