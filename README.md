# BigBurger — Frontend

![CI](https://github.com/wevillegas/bigburger-frontend/actions/workflows/ci.yml/badge.svg)

Frontend de BigBurger, una app de pedidos de comida rápida (mini e-commerce) hecha como proyecto de portfolio: catálogo, carrito, checkout con o sin cuenta, seguimiento de pedidos, panel admin (productos/usuarios/órdenes) y un programa de puntos de fidelidad.

Repo hermano: [bigburger-backend](https://github.com/wevillegas/bigburger-backend) (API + modelo de datos).

## Stack

- React 18 (Create React App) + React Router v6
- Ant Design (antd) como librería de componentes
- Sass para estilos
- axios para la capa HTTP
- Tests: Jest + React Testing Library (vía `react-scripts test`)

## Setup local

```bash
npm install
cp .env.example .env.local   # apuntar REACT_APP_API_URL al backend
npm run dev                    # http://localhost:3000
```

Requiere el backend corriendo en paralelo (ver su README) para que el login, el catálogo y el checkout funcionen.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `REACT_APP_API_URL` | URL base de la API backend (ej. `http://localhost:3100/api`) |

## Tests

```bash
npm test
```

Tests unitarios sobre:
- `src/utils/ticket.js` y `src/utils/date.js`: formateo de tickets y fechas, funciones puras.
- `src/pages/Orders/Cart.jsx`: flujo de checkout de invitado — cálculo de subtotal, validación de datos obligatorios antes de confirmar, y payload enviado al backend.

## CI

GitHub Actions (`.github/workflows/ci.yml`) corre la suite de tests en cada push/PR.

## Capturas

_Pendiente: agregar screenshots del catálogo, carrito y panel admin antes de compartir el repo._

## Decisiones de arquitectura

- **Roles en un solo layout**: `Home` + `Sidebar` condicionan qué páginas ve cada rol (cliente vs. admin) en vez de tener dos apps/layouts separados, porque comparten header, auth y navegación.
- **Carrito en `localStorage`, reconciliado contra el catálogo al entrar**: el carrito sobrevive a un refresh sin pedir login, pero si un producto cambió de precio o se quedó sin stock desde que se agregó, se sincroniza (y avisa al usuario) al abrir `Cart`; el backend igual revalida todo al confirmar.
- **`AuthProvider` + contexto único para user/token**: evita pasar props de autenticación por toda la jerarquía; `useAuth()` es el único punto de acceso, y un interceptor de axios desloguea automáticamente ante un 401/403 del backend.
- **Checkout sin cuenta como primera clase, no como excepción**: `Cart` arma un payload distinto (nombre/teléfono vs. token) según haya o no sesión, en vez de forzar registro para comprar.
