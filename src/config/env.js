// única lectura de la variable de entorno: el resto de la app importa API_URL de acá
// (el nombre REACT_APP_API_URL se mantiene por compatibilidad con el hosting; ver envPrefix en vite.config.mjs)
export const API_URL = import.meta.env.REACT_APP_API_URL
