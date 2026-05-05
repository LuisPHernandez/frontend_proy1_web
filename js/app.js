/**
 * Lista global/local que guarda los jugadores actualmente mostrados.
 *
 * Se actualiza cada vez que los filtros reciben una nueva lista de jugadores
 * desde la API.
 *
 * @type {Array<Object>}
 */
let allPlayers = [];

/**
 * Inicializa el listener del botón de exportar.
 */
document.getElementById("btnExport").addEventListener("click", () => {
    exportToCSV(allPlayers);
});

/**
 * Callback que se ejecuta cuando una acción dentro de los modales termina
 * correctamente.
 *
 * Por ejemplo, después de crear, editar o eliminar un jugador, se vuelven
 * a aplicar los filtros para refrescar la lista en pantalla.
 *
 * @returns {Promise<void>}
 */
async function onSuccess() {
    await filters.applyFilters(true);
}

/**
 * Abre el modal de edición para el jugador seleccionado.
 *
 * Esta función se pasa como callback a `renderPlayers`, para que cada card
 * o fila de jugador pueda abrir su propio modal de edición.
 *
 * @param {Object} player - Jugador que se desea editar.
 * @returns {void}
 */
function onEdit(player) {
    modals.openEditModal(player);
}

/**
 * Abre el modal de eliminación para el jugador seleccionado.
 *
 * Esta función se pasa como callback a `renderPlayers`, para que cada card
 * o fila de jugador pueda abrir su propio modal de confirmación de borrado.
 *
 * @param {Object} player - Jugador que se desea eliminar.
 * @returns {void}
 */
function onDelete(player) {
    modals.openDeleteModal(player);
}

/**
 * Inicializa los modales de la aplicación.
 *
 * Se le pasa `onSuccess` para que los modales puedan refrescar la lista
 * de jugadores después de una acción exitosa.
 */
const modals = initModals(onSuccess);

/**
 * Inicializa los filtros de búsqueda, posición, ordenamiento y paginación.
 *
 * `initFilters` recibe un callback que se ejecuta cada vez que se obtienen
 * jugadores filtrados. Dentro de ese callback:
 *
 * - Se actualiza `allPlayers`.
 * - Se renderiza la lista de jugadores.
 * - Se pasan `onEdit` y `onDelete` para conectar los botones de cada jugador
 *   con sus respectivos modales.
 */
const filters = initFilters((players) => {
    allPlayers = players;
    renderPlayers(players, onEdit, onDelete);
});

/**
 * Ejecuta la carga inicial de jugadores.
 *
 * Al iniciar la página, aplica los filtros actuales por primera vez.
 * Como todavía no hay búsqueda ni filtros activos, normalmente carga
 * la primera página de jugadores.
 */
filters.applyFilters();