// Array of path objects, each containing an array of particles
let paths = [];

// How long until the next particle
let framesBetweenParticles = 3;
let nextParticleFrame = 0;

// Location of last created particle
let previousParticlePosition;

// How long it takes for a particle to fade out
let particleFadeFrames = 1000;

function setup() {
  // Crear canvas del tamaño de la ventana
  createCanvas(windowWidth, windowHeight);
  noCursor();
  colorMode(HSB, 360, 100, 100, 1.0);
  previousParticlePosition = createVector();
  
  // Reducir la frecuencia de partículas
  framesBetweenParticles = 3; 
}

function draw() {
  // Crear gradiente radial (desde el centro hacia afuera)
  let gradient = drawingContext.createRadialGradient(
      width/2, height/2, 0,          // Centro del círculo interno (x, y, radio)
      width/2, height/2, width/1.5    // Centro del círculo externo (x, y, radio)
  );
  
  gradient.addColorStop(0, 'rgba(242,75,75,1)');    // Color central (rojo)
  gradient.addColorStop(1, 'rgba(166,125,50,1)');   // Color exterior (marrón/dorado)
  
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


// Ajustar tamaño del canvas cuando la ventana cambie de tamaño
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Crear un nuevo path cuando el mouse es presionado
function mousePressed() {
  nextParticleFrame = frameCount;
  paths.push(new Path());

  // Reiniciar la posición del mouse
  previousParticlePosition.set(mouseX, mouseY);
  createParticle();
}

// Agregar partículas cuando el mouse se arrastra
function mouseDragged() {
  // Si es momento de un nuevo punto
  if (frameCount >= nextParticleFrame) {
    createParticle();
  }
}

function createParticle() {
  let mousePosition = createVector(mouseX, mouseY);

  let velocity = p5.Vector.sub(mousePosition, previousParticlePosition);
  velocity.mult(0.05);

  let lastPath = paths[paths.length - 1];
  lastPath.addParticle(mousePosition, velocity);

  nextParticleFrame = frameCount + framesBetweenParticles;

  previousParticlePosition.set(mouseX, mouseY);
}

// Clase Path
class Path {
  constructor() {
    this.particles = [];
  }

  addParticle(position, velocity) {
    let particleHue = (frameCount * 0.5) % 360;
    this.particles.push(new Particle(position, velocity, particleHue));
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }
  }

  connectParticles(particleA, particleB) {
    let opacity = particleA.framesRemaining / particleFadeFrames;
    let hue = (particleA.hue + 180) % 360; 
    stroke(hue, 80, 100, opacity * 225);
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

        if (i < this.particles.length - 1) {
          this.connectParticles(this.particles[i], this.particles[i + 1]);
        }
      }
    }
  }
}

// Clase Particle
class Particle {
  constructor(position, velocity, hue) {
    this.position = position.copy();
    this.velocity = velocity.copy();
    this.drag = 0.98; 
    this.framesRemaining = particleFadeFrames;
    this.baseSize = 20; 
    this.hue = hue;
  }

  update() {
    this.velocity.mult(this.drag);
    this.velocity.mult(0.7); 
    this.position.add(this.velocity);
    this.framesRemaining--;
  }

  display() {
    let opacity = this.framesRemaining / particleFadeFrames;
    noStroke();
    fill(this.hue, 80, 100, opacity * 0.8);
    circle(this.position.x, this.position.y, this.baseSize);
  }
}
  
  class ParticleSystem {
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
      stroke(217, 180, 230, opacity * 255); // Color #D9B4E6 with transparency
      line(
        particleA.position.x,
        particleA.position.y,
        particleB.position.x,
        particleB.position.y
      );
    }
  
    display() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (this.particles[i].framesRemaining <= 0) {
          this.particles.splice(i, 1);
        } else {
          this.particles[i].display();
  
          if (i < this.particles.length - 1) {
            this.connectParticles(this.particles[i], this.particles[i + 1]);
          }
        }
      }
    }
  }


  window.updateParticles = function(settings) {
    // Actualizar las variables globales que controlan las partículas
    if (typeof particleColor !== 'undefined') {
        particleColor = color(settings.color);
        particleColor.setAlpha(settings.opacity * 255);
    }
    
    if (typeof connectionColor !== 'undefined') {
        connectionColor = color(settings.connectionColor);
        connectionColor.setAlpha(settings.connectionOpacity * 255);
    }

    // Actualizar otras propiedades según tus variables existentes
    // Por ejemplo:
    if (typeof particleSize !== 'undefined') {
        particleSize = settings.size;
    }

    if (typeof particleSpeed !== 'undefined') {
        particleSpeed = settings.speed;
    }

    // Asegúrate de que estos nombres de variables coincidan con los que usas en tu código
    console.log('Configuración actualizada:', settings);
}