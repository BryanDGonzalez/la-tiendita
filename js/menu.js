// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Intentar obtener los elementos
        const openMenu = document.querySelector("#open-menu");
        const closeMenu = document.querySelector("#close-menu");
        const aside = document.querySelector("aside");

        // Verificar si los elementos existen antes de agregar los event listeners
        if (!openMenu || !closeMenu || !aside) {
            throw new Error('Elementos del menú no encontrados');
        }

        // Agregar los event listeners
        openMenu.addEventListener("click", function() {
            aside.classList.add("aside-visible");
        });

        closeMenu.addEventListener("click", function() {
            aside.classList.remove("aside-visible");
        });

    } catch (error) {
        console.log('Error en la inicialización del menú:', error);
    }
});