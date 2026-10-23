// lee JSON de localStorage sin romper la app si el valor falta o quedó corrupto (devuelve null)
export function readJSON(key) {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch {
        return null
    }
}
