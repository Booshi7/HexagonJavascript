let board;
let boardh = 690;
let boardw = 690;
let context;

let arrowh = 50;
let arroww = 50;
let arrowrot = -Math.PI / 2;
let arrowimg;
let modulatedArrowImg;

let arrow = {
    width: arroww,
    height: arrowh,
    baseImage: new Image()
}

let formehexagonale = {
    width: 150,
    height: 150,
    img: null,
}

let bg = {
    width: 1000,
    height: 1000,
    img: null,
}

let center = {
    x: boardw / 2,
    y: boardh / 2,
}

let gameover = false;
let score = 0;
let rotationspeed = 0.1;
let globalrotation = 0;
let keys = {};

// FPS
let lastFrameTime = 0;
let fps = 0;
let fpsCounter;

//Touches
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

//fonction de départ (je crois)
window.onload = function() {
    board = document.getElementById("board");
    board.height = boardh;
    board.width = boardw;
    context = board.getContext("2d");

    arrowimg = document.getElementById("trianglerotated");
    arrow.baseImage.src = arrowimg.src;
    formehexagonale.img = document.getElementById("hexagonal")

    bg.img = document.getElementById("bg");


    fpsCounter = document.getElementById("fpsCounter");

    modulatedArrowImg = arrow.baseImage; // Initialisation avec l'image de base

    requestAnimationFrame(update);
}

//Boucle (je crois)
function update(timestamp) {
    // truc de fps
    if (lastFrameTime) {
        const deltaTime = timestamp - lastFrameTime;
        fps = Math.round(1000 / deltaTime);
        fpsCounter.textContent = "FPS: " + fps;
    }
    lastFrameTime = timestamp;

    context.clearRect(0, 0, board.width, board.height);

    //Contrôles
    if (keys['q']) {
        arrowrot -= rotationspeed;
        modulatedArrowImg = modulate(arrow.baseImage, '#FF0000');
    }
    else if (keys['d']) {
        arrowrot += rotationspeed;
        modulatedArrowImg = modulate(arrow.baseImage, '#012ef8');
    }
    else if (keys['z']) {
        modulatedArrowImg = modulate(arrow.baseImage, '#ffffff');
    }

    // Draw + global rotation
    globalrotation += 0.00;
    context.save()
    context.translate(center.x, center.y)
    context.rotate(globalrotation)
    drawbg();
    drawArrow();
    drawhexagonal();
    context.restore();

    requestAnimationFrame(update);
}

function drawArrow() {
    context.save();
    context.rotate((arrowrot + Math.PI / 2) * 1);
    context.drawImage(modulatedArrowImg, -arrow.width / 2, -arrow.height / 2 - 100, arrow.width, arrow.height);
    context.restore();
}

function drawhexagonal() {
    context.drawImage(formehexagonale.img, -formehexagonale.width / 2, -formehexagonale.height / 2, formehexagonale.width, formehexagonale.height);
}

function drawbg() {
    context.drawImage(bg.img, -bg.width / 2, -bg.height / 2, bg.width, bg.height);
}

function modulate(image, color) {
    // Crée un canvas temporaire pour dessiner l'image (sans je sais pas pouquoi j'ai un problème de taille d'image)d
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');

    tempCanvas.width = image.width;
    tempCanvas.height = image.height;

    // Dessine l'image de base sur le canvas temporaire
    tempContext.drawImage(image, 0, 0);

    // Récupère les données des pixels de l'image
    const imageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    // Parse la couleur
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Applique le filtre de couleur
    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] * r) / 255;     // Red
        data[i + 1] = (data[i + 1] * g) / 255; // Green
        data[i + 2] = (data[i + 2] * b) / 255; // Blue
    }

    // Replace les données de pixels modifiées dans le canvas temporaire
    tempContext.putImageData(imageData, 0, 0);

    // Crée une nouvelle image à partir du canvas modifié
    const modulatedImage = new Image();
    modulatedImage.src = tempCanvas.toDataURL();

    return modulatedImage;
}
