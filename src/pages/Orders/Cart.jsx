import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Modal, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import "./Cart.scss";

const URL = process.env.REACT_APP_API_URL;

export const Cart = ({ bCount }) => {
  const auth = useAuth();
  const initialCart = JSON.parse(localStorage.getItem("inCart")) || [];

  const [order, setOrder] = useState(initialCart);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("inCart", JSON.stringify(order));
    bCount(order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const total = order.reduce((sum, item) => sum + item.price * item.cantidad, 0);

  const removeFromCart = (id) => {
    setOrder((prev) => prev.filter((item) => item._id !== id));
  };

  const changeQuantity = (id, value) => {
    if (value < 1) return;
    setOrder((prev) =>
      prev.map((item) => (item._id === id ? { ...item, cantidad: value } : item))
    );
  };

  const changeNote = (id, note) => {
    setOrder((prev) =>
      prev.map((item) => (item._id === id ? { ...item, note } : item))
    );
  };

  const sendOrder = async () => {
    setSubmitting(true);
    try {
      const ticket = { user: auth.user, menu: order, total };
      await axios.post(`${URL}/order`, ticket);
      setOrder([]);
      Modal.success({
        title: "Orden enviada",
        content: `Recibimos tu pedido correctamente, su total a abonar es $${total}`,
        okText: "Ok",
      });
    } catch (error) {
      Modal.error({
        title: "No pudimos enviar tu pedido",
        content: "Revisá tu conexión e intentá nuevamente",
        okText: "Ok",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (order.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingOutlined className="cart-empty-icon" />
        <h2>Tu carrito está vacío</h2>
        <p>Agregá productos desde el menú para armar tu pedido.</p>
        <Link to="/" className="cart-empty-cta">Ver el menú</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Typography.Title level={1}>Mi Pedido</Typography.Title>
        <span className="cart-count">
          {order.length} {order.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      <div className="cart-layout">
        <ul className="cart-items">
          {order.map((item, i) => (
            <li className="cart-item" key={item._id} style={{ "--i": i }}>
              <img className="cart-item-img" src={item.IMG} alt={item.name} />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span className="cart-item-unit">${item.price} c/u</span>
                <input
                  type="text"
                  className="cart-item-note"
                  placeholder="Aclaración (ej: sin cebolla)"
                  maxLength={120}
                  value={item.note || ""}
                  aria-label={`Aclaración para ${item.name}`}
                  onChange={(e) => changeNote(item._id, e.target.value)}
                />
              </div>

              <div className="cart-item-stepper">
                <button
                  type="button"
                  aria-label={`Restar unidad de ${item.name}`}
                  disabled={item.cantidad <= 1}
                  onClick={() => changeQuantity(item._id, item.cantidad - 1)}
                >
                  <MinusOutlined />
                </button>
                <span className="cart-item-qty">{item.cantidad}</span>
                <button
                  type="button"
                  aria-label={`Sumar unidad de ${item.name}`}
                  onClick={() => changeQuantity(item._id, item.cantidad + 1)}
                >
                  <PlusOutlined />
                </button>
              </div>

              <div className="cart-item-subtotal">${item.price * item.cantidad}</div>

              <button
                type="button"
                className="cart-item-remove"
                aria-label={`Quitar ${item.name} del carrito`}
                onClick={() => removeFromCart(item._id)}
              >
                <DeleteOutlined />
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <h2>Resumen</h2>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button
            type="button"
            className="cart-checkout-btn"
            disabled={submitting}
            onClick={sendOrder}
          >
            {submitting ? "Enviando..." : "Confirmar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};
