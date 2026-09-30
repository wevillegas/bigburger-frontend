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
  const [syncNotice, setSyncNotice] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("retiro");
  const [deliveryAddress, setDeliveryAddress] = useState(auth.user?.address || "");
  const [redeemPoints, setRedeemPoints] = useState(false);
  const availablePoints = auth.user?.points || 0;

  useEffect(() => {
    localStorage.setItem("inCart", JSON.stringify(order));
    bCount(order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // el carrito vive en localStorage y puede quedar desactualizado (precio viejo, producto
  // que se quedó sin stock desde que se agregó): lo reconciliamos contra el catálogo real al entrar
  useEffect(() => {
    const syncWithCatalog = async () => {
      if (initialCart.length === 0) return;
      try {
        const { data } = await axios.get(`${URL}/products`);
        const catalog = data.products;
        const removed = [];
        const updated = [];

        const synced = initialCart
          .map((item) => {
            const product = catalog.find((p) => p._id === item._id);
            if (!product || !product.stock) {
              removed.push(item.name);
              return null;
            }
            if (product.price !== item.price) {
              updated.push(product.name);
              return { ...item, price: product.price };
            }
            return item;
          })
          .filter(Boolean);

        if (removed.length || updated.length) {
          setOrder(synced);
          const parts = [];
          if (removed.length) parts.push(`${removed.join(", ")} ya no ${removed.length === 1 ? "está disponible" : "están disponibles"} y se ${removed.length === 1 ? "quitó" : "quitaron"} del carrito`);
          if (updated.length) parts.push(`se actualizó el precio de ${updated.join(", ")}`);
          setSyncNotice(parts.join(". ") + ".");
        }
      } catch {
        // si no se pudo validar contra el catálogo, se deja el carrito como está;
        // el backend igual revalida precio/stock al confirmar el pedido
      }
    };
    syncWithCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = order.reduce((sum, item) => sum + item.price * item.cantidad, 0);
  const discount = auth.user && redeemPoints ? Math.min(availablePoints * 10, subtotal) : 0;
  const total = subtotal - discount;

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
    if (!auth.user && (!guestName.trim() || !guestPhone.trim())) {
      Modal.error({
        title: "Faltan datos",
        content: "Ingresá tu nombre y teléfono para continuar sin cuenta, o iniciá sesión",
        okText: "Ok",
      });
      return;
    }
    if (deliveryMethod === "envio" && !deliveryAddress.trim()) {
      Modal.error({ title: "Falta la dirección", content: "Indicá la dirección de envío", okText: "Ok" });
      return;
    }

    setSubmitting(true);
    try {
      const ticket = {
        menu: order,
        deliveryMethod,
        deliveryAddress: deliveryMethod === "envio" ? deliveryAddress.trim() : undefined,
      };
      if (!auth.user) {
        ticket.guestName = guestName.trim();
        ticket.guestPhone = guestPhone.trim();
      } else if (redeemPoints) {
        ticket.redeemPoints = true;
      }

      const { data } = await axios.post(`${URL}/order`, ticket, {
        headers: auth.token ? { authorization: auth.token } : {},
      });

      setOrder([]);
      if (auth.user && data.newOrder.pointsRedeemed > 0) {
        auth.updateUser({ points: Math.max(0, availablePoints - data.newOrder.pointsRedeemed) });
      }
      setRedeemPoints(false);
      Modal.success({
        title: "Orden enviada",
        content: `Recibimos tu pedido correctamente, su total a abonar es $${data.newOrder.total}`,
        okText: "Ok",
      });
    } catch (error) {
      Modal.error({
        title: "No pudimos enviar tu pedido",
        content: error?.response?.data?.message || "Revisá tu conexión e intentá nuevamente",
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
        {syncNotice ? (
          <p className="cart-empty-sync-notice">{syncNotice}</p>
        ) : (
          <p>Agregá productos desde el menú para armar tu pedido.</p>
        )}
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

      {syncNotice && (
        <div className="cart-sync-notice">
          <span>{syncNotice}</span>
          <button type="button" aria-label="Cerrar aviso" onClick={() => setSyncNotice(null)}>×</button>
        </div>
      )}

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

          {!auth.user && (
            <>
              <div className="cash-field">
                <label htmlFor="guestName">Tu nombre</label>
                <input id="guestName" type="text" maxLength={40} value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
              </div>
              <div className="cash-field">
                <label htmlFor="guestPhone">Tu teléfono</label>
                <input id="guestPhone" type="tel" maxLength={20} placeholder="Para avisarte del pedido" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required />
              </div>
            </>
          )}

          <div className="cash-field">
            <label>Entrega</label>
            <div className="payment-method-options">
              <button type="button" className={`filter-chip${deliveryMethod === "retiro" ? " active" : ""}`} onClick={() => setDeliveryMethod("retiro")}>
                Retiro en el local
              </button>
              <button type="button" className={`filter-chip${deliveryMethod === "envio" ? " active" : ""}`} onClick={() => setDeliveryMethod("envio")}>
                Envío a domicilio
              </button>
            </div>
          </div>

          {deliveryMethod === "envio" && (
            <div className="cash-field">
              <label htmlFor="deliveryAddress">Dirección de envío</label>
              <input id="deliveryAddress" type="text" maxLength={150} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required />
            </div>
          )}

          {auth.user && availablePoints > 0 && (
            <label className="cart-points-toggle">
              <input type="checkbox" checked={redeemPoints} onChange={(e) => setRedeemPoints(e.target.checked)} />
              Usar mis {availablePoints} puntos (-${Math.min(availablePoints * 10, subtotal)})
            </label>
          )}

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="cart-summary-row cart-summary-discount">
              <span>Descuento por puntos</span>
              <span>-${discount}</span>
            </div>
          )}
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
