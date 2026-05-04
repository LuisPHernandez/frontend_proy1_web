/**
 * Maneja la respuesta de una petición HTTP.
 * 
 * - Si la respuesta es 204 (No Content), retorna null.
 * - Si la respuesta no es OK, lanza un error con el mensaje del backend.
 * - Si es exitosa, retorna el JSON parseado.
 * 
 * @async
 * @param {Response} res - Objeto Response de fetch.
 * @returns {Promise<any|null>} Datos parseados o null si no hay contenido.
 * @throws {Error} Si la respuesta no es exitosa.
 */
async function handleResponse(res) {
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error desconocido");
    return data;
}

const api = {

    /**
     * Obtiene todos los jugadores.
     * 
     * @returns {Promise<Object[]>} Lista de jugadores.
     */
    getAll: () =>
        fetch(`${CONFIG.API_URL}/players`).then(handleResponse),

    /**
     * Obtiene un jugador por su ID.
     * 
     * @param {number|string} id - ID del jugador.
     * @returns {Promise<Object>} Datos del jugador.
     */
    getById: (id) =>
        fetch(`${CONFIG.API_URL}/players/${id}`).then(handleResponse),

    /**
     * Crea un nuevo jugador.
     * 
     * @param {Object} player - Datos del jugador.
     * @returns {Promise<Object>} Jugador creado.
     */
    create: (player) =>
        fetch(`${CONFIG.API_URL}/players`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(player),
        }).then(handleResponse),

    /**
     * Actualiza un jugador existente.
     * 
     * @param {number|string} id - ID del jugador.
     * @param {Object} player - Datos actualizados.
     * @returns {Promise<Object>} Jugador actualizado.
     */
    update: (id, player) =>
        fetch(`${CONFIG.API_URL}/players/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(player),
        }).then(handleResponse),

    /**
     * Elimina un jugador por su ID.
     * 
     * @param {number|string} id - ID del jugador.
     * @returns {Promise<null>} Retorna null si la eliminación es exitosa.
     */
    delete: (id) =>
        fetch(`${CONFIG.API_URL}/players/${id}`, {
            method: "DELETE",
        }).then(handleResponse),

    /**
     * Sube una imagen para un jugador.
     * 
     * @param {number|string} id - ID del jugador.
     * @param {File} file - Archivo de imagen.
     * @returns {Promise<Object>} Respuesta del servidor.
     */
    uploadImage: (id, file) => {
        const form = new FormData();
        form.append("file", file);

        return fetch(`${CONFIG.API_URL}/players/${id}/image`, {
            method: "POST",
            body: form,
        }).then(handleResponse);
    },
};