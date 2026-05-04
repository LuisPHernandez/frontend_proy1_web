/**
 * Lista global que almacena los jugadores cargados desde la API.
 * 
 * @type {Object[]}
 */
let allPlayers = [];

/**
 * Carga todos los jugadores desde la API y los renderiza en el UI.
 * 
 * - Actualiza la variable global `allPlayers`
 * - Llama a `renderPlayers` para mostrar los datos
 * 
 * @async
 * @returns {Promise<void>}
 */
async function loadPlayers() {
    try {
        allPlayers = await api.getAll();
        renderPlayers(allPlayers, onEdit, onDelete);
    } catch (err) {
        console.error("Error cargando jugadores:", err);
    }
}

/**
 * Callback que se ejecuta después de una operación exitosa
 * (crear, editar o eliminar jugador).
 * 
 * - Recarga la lista de jugadores
 * 
 * @async
 * @returns {Promise<void>}
 */
async function onSuccess() {
    await loadPlayers();
}

/**
 * Callback al hacer click en "Edit" en una tarjeta.
 * 
 * - Abre el modal de edición
 * 
 * @param {Object} player - Jugador seleccionado.
 */
function onEdit(player) {
    modals.openEditModal(player);
}

/**
 * Callback al hacer click en "Delete" en una tarjeta.
 * 
 * - Abre el modal de confirmación de eliminación
 * 
 * @param {Object} player - Jugador seleccionado.
 */
function onDelete(player) {
    modals.openDeleteModal(player);
}

/**
 * Inicializa el sistema de modales.
 * 
 * - Retorna funciones para abrir modales
 * - Se pasa `onSuccess` para refrescar datos después de acciones
 */
const modals = initModals(onSuccess);

/**
 * Inicializa los filtros de jugadores.
 * 
 * - Usa `allPlayers` como fuente de datos
 * - Conecta callbacks de edición y eliminación
 */
initFilters(() => allPlayers, onEdit, onDelete);

/**
 * Carga inicial de jugadores al iniciar la aplicación.
 */
loadPlayers();