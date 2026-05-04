/**
 * Inicializa los filtros de búsqueda y posición para la lista de jugadores.
 * 
 * - Permite filtrar por nombre (input de texto).
 * - Permite filtrar por posición (botones).
 * - Aplica ambos filtros combinados en tiempo real.
 * - Renderiza los resultados usando `renderPlayers`.
 * 
 * @param {Function} getPlayers - Función que retorna la lista actual de jugadores.
 * @param {Function} onEdit - Callback al hacer click en "Edit".
 * @param {Function} onDelete - Callback al hacer click en "Delete".
 */
function initFilters(getPlayers, onEdit, onDelete) {
    const searchInput = document.getElementById("searchInput");
    const filterBtns = document.querySelectorAll(".filter-btn");

    /** @type {string} Posición activa seleccionada */
    let activePosision = "ALL";

    /** @type {string} Término de búsqueda actual */
    let searchTerm = "";

    /**
     * Aplica los filtros actuales (posición + búsqueda)
     * y renderiza los jugadores filtrados.
     * 
     * @returns {void}
     */
    function applyFilters() {
        const players = getPlayers();

        const filtered = players.filter(player => {
            const matchesPosition =
                activePosision === "ALL" || player.position === activePosision;

            const matchesSearch =
                player.name.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesPosition && matchesSearch;
        });

        renderPlayers(filtered, onEdit, onDelete);
    }

    /**
     * Evento: input de búsqueda
     * 
     * - Actualiza el término de búsqueda.
     * - Reaplica filtros en tiempo real.
     */
    searchInput.addEventListener("input", (e) => {
        searchTerm = e.target.value;
        applyFilters();
    });

    /**
     * Evento: click en botones de filtro
     * 
     * - Cambia la posición activa.
     * - Actualiza estilos (clase "active").
     * - Reaplica filtros.
     */
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            activePosision = btn.dataset.pos;
            applyFilters();
        });
    });
}