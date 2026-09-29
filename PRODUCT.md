# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two roles, same app:
- **USUARIO** (cliente): navega el catálogo de hamburguesas, arma un carrito, confirma un pedido y consulta el estado de sus órdenes propias.
- **ADMINISTRADOR**: además de lo anterior, gestiona el catálogo (alta/edición/baja de productos), gestiona usuarios, y ve/actualiza el estado de todos los pedidos (pendiente → realizado).

Secondary audience for this specific build: **reclutadores técnicos** evaluando el portfolio del autor — ven el producto como muestra de capacidad full-stack (MERN), no como consumidores finales.

## Product Purpose

BigBurger es una app de pedidos de comida rápida (hamburguesas) tipo mini-ecommerce: catálogo, carrito, checkout simple, seguimiento de pedidos y panel admin con CRUD de productos/usuarios/órdenes y autenticación por rol (JWT).

Es un **proyecto de portfolio/CV**, no un negocio real en producción. Éxito = que demuestre dominio de MERN (auth, roles, CRUD, estado async, integración front-back) y que se vea profesional y pulido frente a un reclutador, no que genere ventas reales.

## Positioning

No compite en el mercado real de delivery de comida; es una pieza de demostración técnica. Su valor diferencial frente a otros proyectos de portfolio es la cobertura funcional completa (auth + roles + CRUD de 3 entidades + carrito + estados de orden) mostrada con una identidad visual propia y cuidada, no una plantilla genérica de tutorial.

## Operating Context

- Frontend: React 18 + Create React App, Ant Design (antd) como librería de componentes, Sass, React Router v6, axios.
- Backend: Express + Mongoose sobre MongoDB Atlas, auth JWT vía header `Authorization`, bcrypt para passwords.
- Rutas actuales: `/login` (login + modal de registro), `/*` protegido por `PrivateRoute` → `Home` con sidebar y switch interno de páginas: catálogo (`ProductHome`), carrito (`Cart`), mis órdenes (`MyOrders`), estado de órdenes -admin- (`OrderList`), editar usuarios -admin- (`UserList`/`EditUser`), editar productos -admin- (`Products`/`ProductsAdd`/`ProductList`).
- Layout persistente: `Header` (barra superior) + `Sidebar` (nav lateral con ítems condicionados por rol) envolviendo el contenido de cada página.
- Se corre en local para pruebas (`npm start`/`npm run dev` en cada carpeta); despliegue previsto a Vercel (frontend) + Render (backend) + MongoDB Atlas.

## Capabilities and Constraints

- CRUD completo de productos (nombre, descripción, precio, stock, categoría, imagen) — solo admin puede crear/editar/borrar.
- CRUD de usuarios con roles `ADMINISTRADOR`/`USUARIO`, alta pública vía registro (rol usuario por defecto).
- Carrito en cliente → genera una orden (`POST /order`) con `menu`, `user`, `total`, estado inicial `pendiente`.
- Estado de orden: `pendiente` / `realizado`, editable solo por admin.
- Constraint: es un dataset de demo (seed con productos/usuarios de ejemplo), sin pasarela de pago real ni checkout con dirección/envío — el "pedido" termina en un registro en base de datos, no en logística real.
- Constraint de scope para este rebranding: preservar toda la funcionalidad, rutas, roles y lógica existentes — el trabajo es exclusivamente visual (paleta, tipografía, componentes, layout), no funcional.

## Brand Commitments

- Se mantiene el rubro (comida rápida / hamburguesas) y el nombre **BigBurger**.
- Sin identidad visual previa que preservar: el pedido explícito del usuario es reemplazar por completo el look actual (colores, tipografía, estilo de componentes) — el diseño existente se trata como anti-referencia, no como sistema a extender.

## Evidence on Hand

- Sin copy de marketing, testimonios, ni assets de marca reales más allá del logo placeholder actual (`logo-transparente.png`) y un personaje ilustrado tipo mascota en la pantalla de login — ambos reemplazables, no hay compromiso de mantenerlos.
- Datos de catálogo son de seed/demo (3 productos: Clásica, Doble Bacon, Veggie) — no hay menú real de negocio que respetar.

## Product Principles

1. Priorizar que un reclutador entienda en segundos qué hace la app y que se vea a nivel profesional, no de tutorial.
2. La identidad visual debe sostenerse igual en las 13 páginas/vistas existentes (login, catálogo, carrito, órdenes, admin de productos/usuarios) — consistencia por encima de experimentación página a página.
3. No tocar lógica de negocio, rutas ni permisos por rol al aplicar el rebranding — solo capa visual.
4. Mobile-first razonable: aunque el uso real es de escritorio (demo), no debe romperse en viewport angosto dado que un reclutador puede abrirlo desde el celular.

## Accessibility & Inclusion

Sin requisito específico confirmado más allá del estándar (contraste AA, foco visible, formularios con label) esperado en cualquier entrega profesional.
