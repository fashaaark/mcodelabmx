

// Seleccionar el contenedor correcto y los elementos dentro de él
const animationContainer = document.querySelector(".animation-container");
const images = animationContainer.querySelectorAll("img");

// Obtener las dimensiones del contenedor
function getContainerDimensions() {
    const containerRect = animationContainer.getBoundingClientRect();
    return {
        width: containerRect.width,
        height: containerRect.height,
    };
}

let { width: containerWidth, height: containerHeight } = getContainerDimensions();

// Configurar velocidad y aceleración para cada imagen
const properties = Array.from(images).map(() => ({
    x: Math.random() * containerWidth,
    y: Math.random() * containerHeight,
    speedX: (Math.random() - 0.5) * 4,
    speedY: (Math.random() - 0.5) * 4,
    accelX: (Math.random() - 0.5) * 0.2,
    accelY: (Math.random() - 0.5) * 0.2,
}));

function animateElements() {
    images.forEach((image, index) => {
        const prop = properties[index];

        // Actualizar velocidad con aceleración
        prop.speedX += prop.accelX;
        prop.speedY += prop.accelY;

        // Limitar velocidades máximas
        prop.speedX = Math.max(-1, Math.min(2, prop.speedX));
        prop.speedY = Math.max(-2, Math.min(2, prop.speedY));

        // Calcular nueva posición
        prop.x += prop.speedX;
        prop.y += prop.speedY;

        // Rebotar en los bordes con ajuste de tamaño del elemento
        const elementWidth = image.offsetWidth;
        const elementHeight = image.offsetHeight;

        if (prop.x <= 0 || prop.x + elementWidth >= containerWidth) {
            prop.speedX = -prop.speedX;
            prop.accelX = -prop.accelX;
            prop.x = Math.max(0, Math.min(prop.x, containerWidth - elementWidth));
        }

        if (prop.y <= 0 || prop.y + elementHeight >= containerHeight) {
            prop.speedY = -prop.speedY;
            prop.accelY = -prop.accelY;
            prop.y = Math.max(0, Math.min(prop.y, containerHeight - elementHeight));
        }

        // Aplicar nueva posición
        image.style.left = `${prop.x}px`;
        image.style.top = `${prop.y}px`;
    });

    requestAnimationFrame(animateElements);
}

// Inicializar posiciones y estilos
images.forEach((image, index) => {
    const prop = properties[index];
    image.style.position = "absolute"; // Asegúrate de que las imágenes tengan position: absolute
    image.style.left = `${prop.x}px`;
    image.style.top = `${prop.y}px`;
});

// Actualizar las dimensiones del contenedor al redimensionar la ventana
window.addEventListener("resize", () => {
    const dimensions = getContainerDimensions();
    containerWidth = dimensions.width;
    containerHeight = dimensions.height;
});

// Iniciar animación
animateElements();

document.addEventListener("DOMContentLoaded", () => {
// Configurar el botón de hamburguesa
const hamburgerBtn = document.querySelector(".hamburger-btn");
const menu = document.querySelector(".menu");

if (hamburgerBtn && menu) {
    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        menu.classList.toggle("active");
    });
} else {
    console.error("No se encontraron los elementos necesarios para el menú hamburguesa.");
}
});

// Añadir event listener al botón de hamburguesa
hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    menu.classList.toggle("active");
});

