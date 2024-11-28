document.addEventListener('DOMContentLoaded', function() {
    // Valores por defecto para las partículas
    const defaultSettings = {
        color: '#F26D85',      
        opacity: 0.6,          
        size: 20,             
        speed: 1,              
        shape: 'circle',       
        density: 1,            
        trail: true           
    };

    // Variables globales para las partículas
    window.particleConfig = { ...defaultSettings };

    // Configurar el editor
    const editor = CodeMirror.fromTextArea(document.getElementById("particleEditor"), {
        mode: "javascript",
        theme: "monokai",
        lineNumbers: true,
        autoCloseBrackets: true,
        tabSize: 4,
        lineWrapping: true,
        viewportMargin: Infinity,
        scrollbarStyle: null,
        styleActiveLine: true
    });

    // Establecer el valor inicial con comentarios explicativos
    editor.setValue(`// Modifica estos valores para cambiar las partículas
const particleSettings = {
    color: '#F26D85',    // Ccódigos hex 
    opacity: 0.6,        // 0 invisible / 1 sólido
    size: 20,             
    speed: 1,            
    shape: 'circle',     // 'circle', 'square', 'triangle'
    density: 1,          // número menor = más partículas
    trail: true         // true = con estela, false = sin estela
};`);

    // Aplicar cambios
    document.querySelector('.apply-changes').addEventListener('click', function() {
        try {
            const code = editor.getValue();
            const extractSettings = new Function(`
                ${code}
                return particleSettings;
            `);
            
            const settings = extractSettings();
            
            if (settings && typeof settings === 'object') {
                window.particleConfig = { ...settings };
                console.log('Nuevos settings aplicados:', window.particleConfig);
            }
        } catch (error) {
            console.error('Error al aplicar cambios:', error);
        }
    });

    // Reset
    document.querySelector('.reset-code').addEventListener('click', function() {
        editor.setValue(`// Modifica estos valores para cambiar las partículas
const particleSettings = ${JSON.stringify(defaultSettings, null, 2)};`);
        window.particleConfig = { ...defaultSettings };
    });
});

// scolores.js
let paths = [];
let framesBetweenParticles = 5;
let nextParticleFrame = 0;
let previousParticlePosition;
let particleFadeFrames = 800;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noCursor();
    colorMode(RGB);
    previousParticlePosition = createVector();
    framesBetweenParticles = 8;
    particleFadeFrames = 600;
}

function draw() {
    // Crear gradiente
    let gradient = drawingContext.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(242,75,75,1)');    // Color superior (rojo)
    gradient.addColorStop(1, 'rgba(95,136,217,1)');   // Color inferior (azul)
    
    // Aplicar gradiente
    drawingContext.fillStyle = gradient;
    drawingContext.fillRect(0, 0, width, height);
    
    // Resto del código para dibujar las partículas
    for (let path of paths) {
        path.update();
        push();
        blendMode(SCREEN);
        path.display();
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    nextParticleFrame = frameCount;
    paths.push(new Path());
    previousParticlePosition.set(mouseX, mouseY);
    createParticle();
}

function mouseDragged() {
    if (frameCount >= nextParticleFrame) {
        createParticle();
    }
}

function createParticle() {
    let mousePosition = createVector(mouseX, mouseY);
    let velocity = p5.Vector.sub(mousePosition, previousParticlePosition);
    velocity.mult(0.05);

    let lastPath = paths[paths.length - 1];
    
    // Usar la densidad configurada
    if (!window.particleConfig || frameCount % window.particleConfig.density === 0) {
        lastPath.addParticle(mousePosition, velocity);
    }

    nextParticleFrame = frameCount + framesBetweenParticles;
    previousParticlePosition.set(mouseX, mouseY);
}

class Path {
    constructor() {
        this.particles = [];
    }

    addParticle(position, velocity) {
        this.particles.push(new Particle(position, velocity));
    }

    update() {
        for (let particle of this.particles) {
            particle.update();
        }
    }

    connectParticles(particleA, particleB) {
        let opacity = particleA.framesRemaining / particleFadeFrames;
        if (window.particleConfig) {
            opacity *= window.particleConfig.opacity;
            let c = color(window.particleConfig.color);
            stroke(red(c), green(c), blue(c), opacity * 255);
        } else {
            stroke(0, 255, 0, opacity * 255);
        }
        line(
            particleA.position.x,
            particleA.position.y,
            particleB.position.x,
            particleB.position.y
        );
    }

    display() {
        for (let i = this.particles.length - 1; i >= 0; i -= 1) {
            if (this.particles[i].framesRemaining <= 0) {
                this.particles.splice(i, 1);
            } else {
                this.particles[i].display();

                if (i < this.particles.length - 1 && 
                    (!window.particleConfig || window.particleConfig.trail)) {
                    this.connectParticles(this.particles[i], this.particles[i + 1]);
                }
            }
        }
    }
}

class Particle {
    constructor(position, velocity) {
        this.position = position.copy();
        this.velocity = velocity.copy();
        this.drag = 0.95;
        this.framesRemaining = particleFadeFrames;
        this.baseSize = 24;
    }

    update() {
        let speedMultiplier = window.particleConfig ? window.particleConfig.speed : 2;
        this.velocity.mult(this.drag * speedMultiplier);
        this.position.add(this.velocity);
        this.framesRemaining--;
    }

    display() {
        let opacity = this.framesRemaining / particleFadeFrames;
        if (window.particleConfig) {
            opacity *= window.particleConfig.opacity;
            let c = color(window.particleConfig.color);
            noStroke();
            fill(red(c), green(c), blue(c), opacity * 255);
            
            let size = this.baseSize * (window.particleConfig.size / 8);
            
            switch(window.particleConfig.shape) {
                case 'square':
                    rectMode(CENTER);
                    square(this.position.x, this.position.y, size);
                    break;
                case 'triangle':
                    let halfSize = size / 2;
                    triangle(
                        this.position.x, this.position.y - halfSize,
                        this.position.x - halfSize, this.position.y + halfSize,
                        this.position.x + halfSize, this.position.y + halfSize
                    );
                    break;
                default: // 'circle'
                    circle(this.position.x, this.position.y, size);
            }
        } else {
            noStroke();
            fill(146, 133, 166, opacity * 255);
            circle(this.position.x, this.position.y, this.baseSize);
        }
    }
}

// Funcionalidad para la sección de aprendizaje
document.addEventListener('DOMContentLoaded', function() {
    const learnButton = document.querySelector('.learn-section-button');
    const learnContent = document.querySelector('.learn-content');
    
    if (learnButton && learnContent) {
        learnButton.addEventListener('click', function() {
            learnButton.classList.toggle('active');
            learnContent.classList.toggle('visible');
            learnContent.classList.toggle('hidden');
            
            // Scroll suave hacia la sección si está visible
            if (learnContent.classList.contains('visible')) {
                learnContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Animación de entrada para las tarjetas
    const colorCards = document.querySelectorAll('.color-card');
    colorCards.forEach((card, index) => {
        // Usar GSAP si está disponible
        if (typeof gsap !== 'undefined') {
            gsap.from(card, {
                duration: 0.6,
                opacity: 0,
                y: 20,
                delay: index * 0.2,
                ease: "power2.out"
            });
        }
    });
});

