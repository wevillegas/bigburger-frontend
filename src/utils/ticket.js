import { formatDateTime } from './date';

const PAYMENT_LABEL = { efectivo: 'Efectivo', transferencia: 'Transferencia', tarjeta: 'Tarjeta' };
const LINE = '----------------------------------------';

// arma el ticket como texto plano, igual al formato que se imprime desde Pedido en Caja
export function buildTicketText(order) {
    const lines = [];

    lines.push('BIGBURGER');
    lines.push('Av. Aconquija 1336, Yerba Buena, Tucumán');
    lines.push('Tel: 3815480041 / 3814029984');
    lines.push(LINE);
    lines.push(`Pedido #${order.key.slice(-6).toUpperCase()}`);
    lines.push(formatDateTime(order.date || order.cretatedAt));

    if (order.channel === 'caja') {
        lines.push(`Para: ${order.customerLabel}`);
        lines.push(`Atendido por: ${order.user}`);
        if (order.linkedCustomerName) lines.push(`Cliente: ${order.linkedCustomerName} (suma puntos)`);
    } else {
        lines.push(`Cliente: ${order.user}${order.isGuest ? ' (invitado)' : ''}`);
        if (order.guestPhone) lines.push(`Teléfono: ${order.guestPhone}`);
    }

    if (order.deliveryMethod === 'envio') {
        lines.push(`Envío a: ${order.deliveryAddress}`);
    } else {
        lines.push('Retiro en el local');
    }

    lines.push(LINE);
    order.menu.forEach((item) => {
        const label = `${item.cantidad}x ${item.name}${item.note ? ` (${item.note})` : ''}`;
        const price = `$${item.price * item.cantidad}`;
        lines.push(label.padEnd(30) + price.padStart(8));
    });
    lines.push(LINE);

    if (order.discount > 0) {
        lines.push('Descuento por puntos'.padEnd(30) + `-$${order.discount}`.padStart(8));
    }
    lines.push('Total'.padEnd(30) + `$${order.total}`.padStart(8));

    if (order.paymentMethod) {
        lines.push(`Pago: ${PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod}`);
    }
    if (order.pointsEarned > 0) {
        lines.push(`Puntos otorgados: ${order.pointsEarned}`);
    }

    lines.push(LINE);
    lines.push('¡Gracias por su compra!');

    return lines.join('\n');
}

export function downloadTicket(order) {
    const text = buildTicketText(order);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${order.key.slice(-6).toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
