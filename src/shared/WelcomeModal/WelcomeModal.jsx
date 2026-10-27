import { Button, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import "./WelcomeModal.scss";

const SEEN_KEY = "welcomeSeen";

// se muestra una vez por sesión del navegador a quien entra sin cuenta
export const WelcomeModal = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => {
    try {
      return !sessionStorage.getItem(SEEN_KEY);
    } catch {
      return true;
    }
  });

  const close = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // sin sessionStorage solo se vuelve a mostrar al recargar
    }
    setOpen(false);
  };

  if (auth.user) return null;

  return (
    <Modal
      visible={open}
      onCancel={close}
      footer={null}
      centered
      className="welcomeModal"
      maskClosable={false}
    >
      <h2>Entrá a tu cuenta y pedí más fácil</h2>
      <ul>
        <li><strong>Sumá puntos:</strong> cada $100 en pedidos completados suma 1 punto, y 1 punto = $10 de descuento.</li>
        <li><strong>Pedí en segundos:</strong> repetí un pedido anterior con un solo toque.</li>
        <li><strong>Seguí tus pedidos:</strong> mirá el estado y tu historial desde tu perfil.</li>
        <li><strong>Tus datos guardados:</strong> sin volver a cargar todo en cada compra.</li>
      </ul>
      <Button type="primary" block onClick={() => { close(); navigate("/login"); }}>
        Iniciar sesión
      </Button>
      <Button type="link" block onClick={close}>
        Continuar como invitado
      </Button>
    </Modal>
  );
};
