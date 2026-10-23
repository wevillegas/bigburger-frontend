import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// CSP como <meta> en el HTML del build: funciona en cualquier hosting estático. El único dato que depende del
// despliegue es el origen de la API (connect-src), que sale de la misma variable que usa la app.
// (frame-ancestors no se puede poner en un <meta>: va en public/_headers, para los hosts que lo soportan)
function cspPlugin(env) {
  return {
    name: 'csp-meta',
    apply: 'build', // en dev Vite inyecta scripts inline (HMR) y una CSP estricta lo rompería
    transformIndexHtml(html) {
      const apiOrigin = env.REACT_APP_API_URL ? new URL(env.REACT_APP_API_URL).origin : ''
      const csp = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // antd aplica estilos inline
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:", // las fotos de producto son URLs externas que carga el admin
        `connect-src 'self' ${apiOrigin}`.trim(),
        "manifest-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
      return html.replace('%CSP%', csp)
    },
  }
}

export default defineConfig(({ mode }) => {
  // se mantiene el nombre REACT_APP_API_URL para no tener que tocar las variables del hosting
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_'])
  return {
    plugins: [react(), cspPlugin(env)],
    envPrefix: ['VITE_', 'REACT_APP_'],
    preview: { port: 3000 },
    server: { port: 3000, watch: { usePolling: true, interval: 300 } }, // el watcher nativo no detecta cambios en esta carpeta (se queda con archivos viejos) // el backend permite este origen por defecto (FRONTEND_URL)
    build: { outDir: 'build' }, // misma carpeta de salida que CRA
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.js',
      css: false,
    },
  }
})
