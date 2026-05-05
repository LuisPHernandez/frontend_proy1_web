/**
 * Inicializa los controles de filtrado, búsqueda, ordenamiento y paginación
 * para la lista de jugadores.
 *
 * Esta función conecta los elementos del DOM con la lógica de consulta a la API.
 * Permite:
 *
 * - Buscar jugadores por nombre usando un input de texto.
 * - Filtrar jugadores por posición usando botones.
 * - Ordenar jugadores por un campo seleccionado.
 * - Cambiar el orden de los resultados entre ascendente y descendente.
 * - Navegar entre páginas usando botones de anterior y siguiente.
 * - Aplicar debounce en la búsqueda para evitar demasiadas llamadas seguidas a la API.
 *
 * Al obtener los resultados, llama a `onResult` para que otra parte del programa
 * se encargue de renderizar los jugadores en pantalla.
 *
 * @param {Function} onResult - Callback que recibe la lista final de jugadores y la renderiza o procesa.
 * @returns {{ applyFilters: Function }} Objeto con la función `applyFilters` para poder ejecutarla manualmente.
 */
function initFilters(onResult) {
    const searchInput = document.getElementById("searchInput");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("sortSelect");
    const orderSelect = document.getElementById("orderSelect");
    const prevBtn = document.getElementById("btnPrev");
    const nextBtn = document.getElementById("btnNext");
    const pageInfo = document.getElementById("pageInfo");

    /** @type {string} Posición activa seleccionada. "ALL" significa que no se filtra por posición. */
    let activePosition = "ALL";

    /** @type {string} Texto ingresado por el usuario en el buscador. */
    let searchTerm = "";

    /** @type {number} Página actual de resultados. */
    let currentPage = 1;

    /** @type {number} Cantidad máxima de jugadores por página. */
    const limit = 12;

    /** @type {string} Campo usado para ordenar los resultados. */
    let sortField = "";

    /** @type {string} Dirección del ordenamiento. Puede ser "asc" o "desc". */
    let sortOrder = "asc";

    /** 
     * Temporizador usado para aplicar debounce en la búsqueda.
     * Sirve para esperar un poco antes de hacer una nueva petición a la API.
     * 
     * @type {ReturnType<typeof setTimeout> | null}
     */
    let debounceTimer = null;

    /**
     * Aplica los filtros, ordenamiento y paginación actuales.
     *
     * Construye un objeto `params` con los parámetros que serán enviados
     * al backend por medio de `api.getAll`.
     *
     * Si `resetPage` es `true`, vuelve a la página 1 antes de consultar.
     * Esto se usa cuando cambia la búsqueda, el filtro o el ordenamiento.
     *
     * Después de obtener los jugadores:
     * - Filtra por posición si la posición activa no es "ALL".
     * - Ejecuta `onResult(filtered)` para mostrar los jugadores filtrados.
     * - Actualiza la información de paginación.
     *
     * @param {boolean} [resetPage=false] - Indica si debe reiniciarse la página actual a 1.
     * @returns {Promise<void>}
     */
    async function applyFilters(resetPage = false) {
        if (resetPage) currentPage = 1;

        const params = {
            page: currentPage,
            limit: limit,
        };

        if (searchTerm) params.q = searchTerm;
        if (sortField) params.sort = sortField;
        if (sortField) params.order = sortOrder;

        try {
            const players = await api.getAll(params);

            const filtered = activePosition === "ALL"
                ? players
                : players.filter(player => player.position === activePosition);

            onResult(filtered);
            updatePagination(players.length);
        } catch (error) {
            console.error("Error al obtener jugadores:", error);
        }
    }

    /**
     * Actualiza los controles de paginación en la interfaz.
     *
     * Muestra la página actual, desactiva el botón de anterior cuando
     * el usuario está en la primera página y desactiva el botón de siguiente
     * cuando la cantidad de resultados obtenida es menor que el límite.
     *
     * @param {number} count - Cantidad de jugadores recibidos en la página actual.
     * @returns {void}
     */
    function updatePagination(count) {
        pageInfo.textContent = `Página ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = count < limit;
    }

    /**
     * Escucha cambios en el input de búsqueda.
     *
     * Cada vez que el usuario escribe, actualiza `searchTerm`.
     * Luego limpia el temporizador anterior y crea uno nuevo para aplicar
     * debounce. Esto evita llamar a la API en cada tecla inmediatamente.
     */
    searchInput.addEventListener("input", (e) => {
        searchTerm = e.target.value.trim();

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            applyFilters(true);
        }, 300);
    });

    /**
     * Escucha clicks en los botones de filtro por posición.
     *
     * Al hacer click:
     * - Quita la clase "active" de todos los botones.
     * - Agrega la clase "active" al botón seleccionado.
     * - Actualiza la posición activa usando `data-pos`.
     * - Aplica los filtros desde la primera página.
     */
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));

            btn.classList.add("active");
            activePosition = btn.dataset.pos;

            applyFilters(true);
        });
    });

    /**
     * Escucha cambios en el selector del campo de ordenamiento.
     *
     * Cuando el usuario selecciona un campo, actualiza `sortField`
     * y vuelve a aplicar los filtros desde la primera página.
     */
    sortSelect.addEventListener("change", () => {
        sortField = sortSelect.value;
        applyFilters(true);
    });

    /**
     * Escucha cambios en el selector del orden.
     *
     * Permite cambiar entre orden ascendente y descendente.
     */
    orderSelect.addEventListener("change", () => {
        sortOrder = orderSelect.value;
        applyFilters(true);
    });

    /**
     * Escucha el click del botón de página anterior.
     *
     * Solo retrocede si la página actual es mayor que 1.
     */
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            applyFilters();
        }
    });

    /**
     * Escucha el click del botón de página siguiente.
     *
     * Aumenta la página actual y vuelve a consultar los datos.
     */
    nextBtn.addEventListener("click", () => {
        currentPage++;
        applyFilters();
    });

    return { applyFilters };
}