// Definir variables globales
var circles = [];
var points = 150;
var smooth = true;
var mousePos;
var center;
var maxDeformation = 20;

var background = new Path.Rectangle({
    point: [0, 0],
    size: view.size,
    fillColor: {
        gradient: {
            stops: [
                ['rgba(242,75,75,1)', 0],    // Color superior: F24B4B (rojo)
                ['rgba(95,136,217,1)', 1]    // Color inferior: 5F88D9 (azul)
            ]
        },
        origin: view.bounds.topCenter,
        destination: view.bounds.bottomCenter
    }
});


// Crear un objeto global para comunicación
paper.circleInterface = {
    changeCircle: function(index) {
        if (circles[index]) {
            console.log('Cambiando círculo en Paper.js:', index);
            circles[index].path.fillColor = getRandomColor();
            circles[index].targetSize = getRandomSize();
        }
    }
};

var screenshotInterface = {
    takeScreenshot: function() {
        console.log('Intentando tomar screenshot...');
        try {
            // Obtener el canvas
            var canvas = document.getElementById('myCanvas1');
            if (!canvas) {
                throw new Error('Canvas no encontrado');
            }
            
            // Convertir el canvas a imagen
            var dataUrl = canvas.toDataURL('image/png');
            
            // Crear un enlace temporal
            var link = document.createElement('a');
            var timestamp = new Date().toISOString().slice(0,19).replace(/[:]/g, '-');
            link.download = 'mcode-art-' + timestamp + '.png';
            link.href = dataUrl;
            
            // Simular clic para descargar
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Screenshot guardado exitosamente!');
        } catch (error) {
            console.error('Error tomando screenshot:', error);
        }
    }
};

// Exponer la interfaz de múltiples formas para asegurar accesibilidad
view.element.screenshotInterface = screenshotInterface;
window.screenshotInterface = screenshotInterface;

// Función para obtener un tamaño aleatorio
function getRandomSize() {
    var minSize = Math.min(view.bounds.width, view.bounds.height) * 0.15;
    var maxSize = Math.min(view.bounds.width, view.bounds.height) * 0.6;
    return Math.random() * (maxSize - minSize) + minSize;
}

function getRandomColor() {
    // Colores más vibrantes
    return new Color({
        hue: Math.random() * 360,
        saturation: 0.9,
        brightness: 1,
        alpha: 0.7
    });
}

function initializeCircles() {
    center = view.center;
    mousePos = view.center;

    // Limpiar círculos existentes
    circles.forEach(function(circleObj) {
        if (circleObj.path) {
            circleObj.path.remove();
        }
    });
    circles = [];

    // Crear cinco círculos
    for (var i = 0; i < 5; i++) {
        var randomSize = getRandomSize();
        var circle = new Path.Circle({
            center: center,
            radius: randomSize,
            fillColor: getRandomColor(),
            blendMode: 'difference',
            shadowColor: new Color(1, 1, 1, 0.2),
            shadowBlur: 30
        });

        var segmentPoints = [];
        for (var j = 0; j < points; j++) {
            var angle = (j / points) * Math.PI * 2;
            var x = center.x + randomSize * Math.cos(angle);
            var y = center.y + randomSize * Math.sin(angle);
            segmentPoints.push(new Point(x, y));
        }
        
        circle.segments = segmentPoints;
        circle.smooth();

        circles.push({
            path: circle,
            basePoints: circle.segments.map(function(segment) {
                return segment.point.clone();
            }),
            phase: i * 72,
            currentSize: randomSize,
            targetSize: randomSize,
            sizeVelocity: 0
        });
    }
    
    console.log('Círculos inicializados:', circles.length);
}

function updateCircleSize(circleObj) {
    var circle = circleObj.path;
    var diff = circleObj.targetSize - circleObj.currentSize;
    
    circleObj.sizeVelocity += diff * 0.2;
    circleObj.sizeVelocity *= 0.7;
    circleObj.currentSize += circleObj.sizeVelocity;

    circleObj.basePoints = circleObj.basePoints.map(function(basePoint, i) {
        var angle = (i / points) * Math.PI * 2;
        return new Point(
            center.x + circleObj.currentSize * Math.cos(angle),
            center.y + circleObj.currentSize * Math.sin(angle)
        );
    });
}

function onFrame(event) {
    circles.forEach(function(circleObj, index) {
        updateCircleSize(circleObj);

        var circle = circleObj.path;
        var basePoints = circleObj.basePoints;
        var phase = circleObj.phase;

        for (var i = 0; i < points; i++) {
            var segment = circle.segments[i];
            var basePoint = basePoints[i];
            var sinSeed = (event.count * 3) + (i * 4) + phase;
            
            var vector = basePoint.subtract(center);
            var deform = Math.sin(sinSeed / 50) * maxDeformation;
            var lengthScale = 1 + (deform / 150);
            
            vector.length *= lengthScale;
            segment.point = center.add(vector);
        }

        if (smooth) {
            circle.smooth({ type: 'continuous', factor: 0.5 });
        }

        circle.rotate(0.2);
    });
}

function onMouseMove(event) {
    mousePos = event.point;
    var vector = mousePos.subtract(center);
    maxDeformation = Math.min(30, vector.length / 8);
}

function onMouseDown(event) {
    if (!event.event.target.closest('button')) {
        circles.forEach(function(circleObj) {
            circleObj.targetSize = getRandomSize();
        });
    }
}

function onResize(event) {
    center = view.center;
    initializeCircles();
}

var circleInterface = {
    changeCircle: function(index) {
        console.log('Intentando cambiar círculo:', index);
        if (circles[index]) {
            console.log('Cambiando círculo:', index);
            circles[index].path.fillColor = getRandomColor();
            circles[index].targetSize = getRandomSize();
        }
    }
};

// Asegurarse de que el background se actualice cuando se redimensiona la ventana
function onResize(event) {
    // Actualizar el background
    background.bounds = view.bounds;

// Exponer la interfaz globalmente
view.element.circleInterface = circleInterface;
window.paperCircleInterface = circleInterface;

// Inicializar todo
initializeCircles();
}

// Añade esto junto a tus otras funciones de interfaz
paper.circleInterface = {
    changeCircle: function(index) {
        if (circles[index]) {
            console.log('Cambiando círculo en Paper.js:', index);
            circles[index].path.fillColor = getRandomColor();
            circles[index].targetSize = getRandomSize();
        }
    },
    
    takeScreenshot: function() {
        // Obtener el canvas
        var canvas = document.getElementById('myCanvas1');
        
        try {
            // Convertir el canvas a imagen
            var dataUrl = canvas.toDataURL('image/png');
            
            // Crear un enlace temporal
            var link = document.createElement('a');
            link.download = 'circles-artwork-' + new Date().getTime() + '.png';
            link.href = dataUrl;
            
            // Simular clic para descargar
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Screenshot saved!');
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }
    }
};

// Notificar que Paper.js está listo
var event = new CustomEvent('paperReady');
window.dispatchEvent(event);

// Añade esto junto con las otras funciones de la interfaz
paper.circleInterface = {
    changeCircle: function(index) {
        if (circles[index]) {
            console.log('Cambiando círculo en Paper.js:', index);
            circles[index].path.fillColor = getRandomColor();
            circles[index].targetSize = getRandomSize();
        }
    },
    
};

console.log('Paper.js inicializado, interface de screenshot disponible');


