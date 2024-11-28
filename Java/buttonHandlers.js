// Esperar a que Paper.js esté listo
window.addEventListener('paperReady', function() {
    console.log('Paper.js está listo');
    
    // botones de color
    const buttons = document.querySelectorAll('[id^="changeColorButton"]');
    
    buttons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botón clickeado:', index);
            
            // Intentar obtener la interfaz de múltiples lugares
            const canvas = document.getElementById('myCanvas1');
            const interface = window.paperCircleInterface || 
                            (canvas && canvas.circleInterface);
            
            if (interface) {
                console.log('Interfaz encontrada, cambiando círculo');
                interface.changeCircle(index);
            } else {
                console.error('No se encontró la interfaz de círculos');
                console.log('Estado del canvas:', canvas);
                console.log('Estado de window.paperCircleInterface:', window.paperCircleInterface);
            }
        });
    });
});

// Configurar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, esperando Paper.js');

    //  botón de screenshot
    const screenshotLink = document.getElementById('screenshotButton');
    if (screenshotLink) {
        screenshotLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en botón screenshot');
            
            // Intentar obtener la interfaz de varias formas
            const interface = window.screenshotInterface || 
                            (document.getElementById('myCanvas1') && 
                             document.getElementById('myCanvas1').screenshotInterface);
            
            if (interface && interface.takeScreenshot) {
                interface.takeScreenshot();
            } else {
                console.error('No se encontró la función de screenshot');
                // Debugging info
                console.log('Estado de window.screenshotInterface:', window.screenshotInterface);
                console.log('Estado del canvas:', document.getElementById('myCanvas1'));
            }
        });
    }
});

window.screenshotInterface = {
    takeScreenshot: function() {
        let now = new Date();
        let timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
        saveCanvas(`particle_art_${timestamp}`, 'png');
    }
};