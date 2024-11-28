// Configuración inicial
function setup() {
    createCanvas(800, 800);
    background(255, 255, 204); // Color de fondo amarillo claro
  }
  
  // Dibuja la animación
  function draw() {
    // Efecto de parpadeo
    if (frameCount % 60 < 30) {
      fill(0); // Texto negro
    } else {
      fill(255, 255, 204); // Texto amarillo claro
    }
    
    // Dibuja el texto "MONDAY"
    textSize(150);
    textAlign(CENTER, CENTER);
    text("MONDAY", width / 2, height / 2);
    
    // Efecto de desgaste
    if (frameCount % 120 < 60) {
      fill(0, 0, 0, 100); // Negro semi-transparente
      rect(0, 0, width, height);
    }
  }