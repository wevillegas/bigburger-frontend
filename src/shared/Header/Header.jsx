import logo from '../../assets/img/logo.png'
import { readJSON } from '../../utils/storage'

import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";
export const Header = ({productsQty, onMenuClick}) => {
   const currentUser = readJSON('currentUser');
   const isAdmin = currentUser?.role === "ADMINISTRADOR";
   return (
    <>
      <div className="navbar">
        <button
          type="button"
          className="menuToggle"
          aria-label="Abrir menú"
          onClick={onMenuClick}
        >
          <MenuOutlined />
        </button>
        <NavLink to="/" className="brandMark">
          <img className="brandLogo" src={logo} alt="" width="34" height="34" />
          <span className="brandWord">BIGBURGER</span>
        </NavLink>
        {!isAdmin && (
          <NavLink className="nav-cart" to="/cart">
            <ShoppingCartOutlined />
            <span className="nav-cart-label">Carrito</span>
            <Badge count={productsQty} className='badge' showZero />
          </NavLink>
        )}
      </div>

    </>
  );
};
