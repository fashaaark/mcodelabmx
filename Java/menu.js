const hamburgerBtn = document.querySelector(".hamburger-btn");
const menu = document.querySelector(".menu");

if (hamburgerBtn && menu) { // Comprueba si los elementos existen
    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        menu.classList.toggle("active");
    });
} else {
    console.error("Botón hamburguesa o menú no encontrados");
}

