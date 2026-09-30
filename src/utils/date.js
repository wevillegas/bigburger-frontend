// fecha + hora consistente en toda la app: pedidos, tickets, etc.
export function formatDateTime(iso) {
    const date = new Date(iso);
    const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${date.toLocaleDateString('es-AR')} ${time}`;
}
