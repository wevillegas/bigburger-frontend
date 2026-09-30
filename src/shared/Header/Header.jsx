
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Menu, Switch } from "antd";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";
export const Header = ({productsQty, onMenuClick}) => {
   const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
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
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <polygon points="0,26 13,0 13,26" fill="var(--color2)" />
            <polygon points="13,26 13,0 26,26" fill="var(--color3)" />
          </svg>
          <span className="brandWord">BIGBURGER</span>
        </NavLink>
        {!isAdmin && (
          <NavLink className="nav-cart" to="/cart">
            <ShoppingCartOutlined />
            <span>Carrito</span>
            <Badge count={productsQty} className='badge' showZero />
          </NavLink>
        )}
      </div>

    </>
  );
};
