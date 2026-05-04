/**
 * Inicializa la lógica de los modales (crear, editar y eliminar jugadores).
 * 
 * - Maneja apertura/cierre de modales
 * - Maneja submit del formulario (create/update)
 * - Maneja subida y preview de imagen
 * - Maneja confirmación de eliminación
 * 
 * @param {Function} onSuccess - Callback que se ejecuta después de una operación exitosa (refresh de datos).
 * @returns {{ openEditModal: Function, openDeleteModal: Function }} Funciones expuestas para uso externo.
 */
function initModals(onSuccess) {
    /*
    Referencias al DOM
    */
    const playerOverlay = document.getElementById("playerOverlay");
    const playerModalTitle = document.getElementById("playerModalTitle");
    const playerForm = document.getElementById("playerForm");
    const btnOpenAdd = document.getElementById("btnAdd");
    const btnPlayerClose = document.getElementById("btnPlayerClose");
    const btnPlayerCancel = document.getElementById("btnPlayerCancel");

    const fieldId = document.getElementById("fieldId");
    const fieldName = document.getElementById("fieldName");
    const fieldTeam = document.getElementById("fieldTeam");
    const fieldPosition = document.getElementById("fieldPosition");
    const fieldJersey = document.getElementById("fieldJersey");
    const fieldAge = document.getElementById("fieldAge");
    const fieldNationality = document.getElementById("fieldNationality");
    const fieldPPG = document.getElementById("fieldPPG");
    const fieldAPG = document.getElementById("fieldAPG");
    const fieldRPG = document.getElementById("fieldRPG");

    const imageUploadGroup = document.getElementById("imageUploadGroup");
    const imageUploadArea = document.getElementById("imageUploadArea");
    const imagePreview = document.getElementById("imagePreview");
    const imagePlaceholder = document.getElementById("imagePlaceholder");
    const fieldImage = document.getElementById("fieldImage");

    const deleteOverlay = document.getElementById("deleteOverlay");
    const deleteText = document.getElementById("deleteText");
    const btnDeleteConfirm = document.getElementById("btnDeleteConfirm");
    const btnDeleteCancel = document.getElementById("btnDeleteCancel");
    const btnDeleteClose = document.getElementById("btnDeleteClose");

    /** @type {number|null} ID del jugador a eliminar */
    let deleteTargetId = null;

    /*
    Modal de jugador (crear y editar)
    */

    /**
     * Abre el modal en modo "crear jugador".
     */
    function openAddModal() {
        playerForm.reset();
        fieldId.value = "";
        playerModalTitle.textContent = "Add Player";
        imageUploadGroup.classList.add("hidden");
        playerOverlay.classList.remove("hidden");
    }

    /**
     * Abre el modal en modo "editar jugador".
     * 
     * @param {Object} player - Datos del jugador.
     */
    function openEditModal(player) {
        fieldId.value = player.id;
        fieldName.value = player.name;
        fieldTeam.value = player.team;
        fieldPosition.value = player.position;
        fieldJersey.value = player.jersey_number;
        fieldAge.value = player.age;
        fieldNationality.value = player.nationality;
        fieldPPG.value = player.points_per_game;
        fieldAPG.value = player.assists_per_game;
        fieldRPG.value = player.rebounds_per_game;

        playerModalTitle.textContent = "Edit Player";
        imageUploadGroup.classList.remove("hidden");

        if (player.image_url) {
            imagePreview.src = `${CONFIG.API_URL}${player.image_url}`;
            imagePreview.classList.remove("hidden");
            imagePlaceholder.classList.add("hidden");
        } else {
            imagePreview.classList.add("hidden");
            imagePlaceholder.classList.remove("hidden");
        }

        playerOverlay.classList.remove("hidden");
    }

    /**
     * Cierra el modal de jugador y resetea su estado.
     */
    function closePlayerModal() {
        playerOverlay.classList.add("hidden");
        playerForm.reset();
        imagePreview.classList.add("hidden");
        imagePlaceholder.classList.remove("hidden");
    }

    /*
    Submit del formulario (crear/editar)
    */
    playerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: fieldName.value.trim(),
            team: fieldTeam.value.trim(),
            position: fieldPosition.value,
            jersey_number: parseInt(fieldJersey.value),
            age: parseInt(fieldAge.value),
            nationality: fieldNationality.value.trim(),
            points_per_game: parseFloat(fieldPPG.value) || 0,
            assists_per_game: parseFloat(fieldAPG.value) || 0,
            rebounds_per_game: parseFloat(fieldRPG.value) || 0,
        };

        try {
            const id = fieldId.value;

            if (id) {
                // Actualizar jugador existente
                await api.update(id, payload);

                // Subir imagen si existe
                if (fieldImage.files[0]) {
                    await api.uploadImage(id, fieldImage.files[0]);
                }
            } else {
                // Crear nuevo jugador
                const created = await api.create(payload);

                // Subir imagen si existe
                if (fieldImage.files[0]) {
                    await api.uploadImage(created.id, fieldImage.files[0]);
                }
            }

            closePlayerModal();
            await onSuccess();

        } catch (e) {
            alert(`Error: ${e.message || e}`);
        }
    });

    /*
    Preview de imagen
    */

    /**
     * Muestra preview de la imagen seleccionada antes de subirla.
     */
    fieldImage.addEventListener("change", () => {
        const file = fieldImage.files[0];
        if (!file) return;

        imagePreview.src = URL.createObjectURL(file);
        imagePreview.classList.remove("hidden");
        imagePlaceholder.classList.add("hidden");
    });

    /*
    Modal de eliminación
    */

    /**
     * Abre el modal de confirmación de eliminación.
     * 
     * @param {Object} player - Jugador a eliminar.
     */
    function openDeleteModal(player) {
        deleteTargetId = player.id;
        deleteText.textContent = `Are you sure you want to delete ${player.name}?`;
        deleteOverlay.classList.remove("hidden");
    }

    /**
     * Cierra el modal de eliminación.
     */
    function closeDeleteModal() {
        deleteOverlay.classList.add("hidden");
        deleteTargetId = null;
    }

    /**
     * Cierra el modal al haber un click
     */
    btnDeleteConfirm.addEventListener("click", async () => {
        if (!deleteTargetId) return;

        try {
            await api.delete(deleteTargetId);
            closeDeleteModal();
            await onSuccess();
        } catch (e) {
            alert(`Error: ${e.message || e}`);
        }
    });

    /*
    Eventos de cierre
    */
    btnOpenAdd.addEventListener("click", openAddModal);

    btnPlayerClose.addEventListener("click", closePlayerModal);
    btnPlayerCancel.addEventListener("click", closePlayerModal);

    playerOverlay.addEventListener("click", (e) => {
        if (e.target === playerOverlay) closePlayerModal();
    });

    btnDeleteClose.addEventListener("click", closeDeleteModal);
    btnDeleteCancel.addEventListener("click", closeDeleteModal);

    deleteOverlay.addEventListener("click", (e) => {
        if (e.target === deleteOverlay) closeDeleteModal();
    });

    /*
    Expone para uso de app.js
    */
    return { openEditModal, openDeleteModal };
}