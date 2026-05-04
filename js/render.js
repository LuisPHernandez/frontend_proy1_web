/**
 * Renderiza una lista de jugadores en el grid.
 * 
 * - Limpia el contenido previo.
 * - Muestra un estado vacío si no hay jugadores.
 * - Genera tarjetas con animación escalonada.
 * 
 * @param {Object[]} players - Lista de jugadores.
 * @param {Function} onEdit - Callback al hacer click en "Edit".
 * @param {Function} onDelete - Callback al hacer click en "Delete".
 */
function renderPlayers(players, onEdit, onDelete) {
    const grid = document.getElementById("playersGrid");
    const emptyState = document.getElementById("emptyState");

    grid.innerHTML = "";

    if (players.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    players.forEach((player, index) => {
        const card = buildCard(player, onEdit, onDelete);
        card.style.animationDelay = `${index * 40}ms`;
        grid.appendChild(card);
    });
}

/**
 * Construye una tarjeta HTML para un jugador.
 * 
 * - Incluye foto o placeholder.
 * - Muestra información básica (nombre, equipo, posición).
 * - Agrega botones de acción con eventos.
 * 
 * @param {Object} player - Datos del jugador.
 * @param {Function} onEdit - Callback para editar.
 * @param {Function} onDelete - Callback para eliminar.
 * @returns {HTMLElement} Elemento DOM de la tarjeta.
 */
function buildCard(player, onEdit, onDelete) {
    const card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
    ${buildPhoto(player)}
    <div class="card-body">
        <div class="card-number">${player.jersey_number}</div>
        <div class="card-name">${player.name}</div>
        <div class="card-team">${player.team}</div>
        <div class="card-pos-badge">${player.position}</div>
        <div class="card-actions">
            <button class="card-btn card-btn--edit">Edit</button>
            <button class="card-btn card-btn--delete">Delete</button>
        </div>
    </div>
    `;

    card.querySelector(".card-btn--edit").addEventListener("click", (e) => {
        e.stopPropagation();
        onEdit(player);
    });

    card.querySelector(".card-btn--delete").addEventListener("click", (e) => {
        e.stopPropagation();
        onDelete(player);
    });

    return card;
}

/**
 * Genera el HTML de la foto del jugador.
 * 
 * - Si existe `image_url`, renderiza la imagen.
 * - Si no, muestra un placeholder SVG.
 * 
 * @param {Object} player - Datos del jugador.
 * @param {string} [player.image_url] - URL de la imagen del jugador.
 * @param {string} player.name - Nombre del jugador.
 * @returns {string} HTML string de la imagen o placeholder.
 */
function buildPhoto(player) {
    if (player.image_url) {
        return `
        <img
            class="card-photo"
            src="${CONFIG.API_URL}${player.image_url}"
            alt="${player.name}"
            loading="lazy"
        />
        `;
    }

    return `
    <div class="card-photo-placeholder">
        <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.2"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
    </div>
    `;
}