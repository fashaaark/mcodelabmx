// Crear nuevo archivo: animations.js

document.addEventListener('DOMContentLoaded', () => {
    // Configuración inicial - ocultar todos los botones
    gsap.set(".button-container button", {
        scale: 0,
        opacity: 0
    });

    // Timeline principal
    const tl = gsap.timeline({
        defaults: {
            duration: 0.4,
            ease: "back.out(1.7)"
        }
    });

    // Secuencia de animación
    tl.to(".color1", {
        scale: 1,
        opacity: 1
    })
    .to(".color2", {
        scale: 1,
        opacity: 1
    }, "-=0.2")
    .to(".color3", {
        scale: 1,
        opacity: 1
    }, "-=0.2")
    .to(".color4", {
        scale: 1,
        opacity: 1
    }, "-=0.2")
    .to(".color5", {
        scale: 1,
        opacity: 1
    }, "-=0.2");

    // Play timeline
    tl.play();
});

// En animations.js

document.addEventListener('DOMContentLoaded', () => {
    // ... tu código de animación inicial ...

    // Animación al hacer click en los botones
    const buttons = document.querySelectorAll('.button-container button');
    
    buttons.forEach(button => {
        // Hover animation
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.15,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        // Click animation
        button.addEventListener('click', () => {
            gsap.timeline()
                .to(button, {
                    scale: 0.9,
                    duration: 0.1,
                    ease: "power2.in"
                })
                .to(button, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "elastic.out(1, 0.3)"
                })
                .to(button, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
        });
    });
});