import { Modal, message } from 'antd';
import axios from 'axios';

// debe coincidir con CANCEL_WINDOW_MINUTES del backend (que es quien lo hace cumplir)
export const CANCEL_WINDOW_MINUTES = 5;

// el botón solo se ofrece mientras el pedido está pendiente y dentro del plazo; el admin no tiene plazo
export function canCancel(state, createdAt, isAdmin = false) {
    if (state !== 'pendiente') return false;
    return isAdmin || Date.now() - new Date(createdAt).getTime() < CANCEL_WINDOW_MINUTES * 60 * 1000;
}

// confirma y cancela un pedido pendiente; el backend repone stock y puntos canjeados
export function confirmCancel(url, onDone) {
    Modal.confirm({
        title: '¿Cancelar el pedido?',
        content: 'Se devuelve el stock (y tus puntos, si los usaste) y no se puede deshacer.',
        okText: 'Cancelar pedido',
        cancelText: 'Volver',
        okButtonProps: { danger: true },
        onOk: async () => {
            try {
                await axios.put(url);
                message.success('Pedido cancelado');
                onDone?.();
            } catch (error) {
                message.error(error.response?.data?.message || 'No pudimos cancelar el pedido');
            }
        },
    });
}
