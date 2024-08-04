let board;
let context;
let boardh = 690;
let boardw = 690;


let arrowh = 20;
let arroww = 20;
let arrowrot = -Math.PI / 2;
let arrowimg;
let modulatedArrowImg;
let modulatedBgImg;
let modulatedhexagone;
let colorwheel = 0;
let maxcolor = 3;
let colorcd = maxcolor - 1;
let musiqueoption = true;

//Calcule Delta obstacle
let lastTime = 0;

//KeyBind
let keybind = {
    "left": 'q',
    "right": 'd',
    "restart": ' ',
    "menu": 'Escape'
}

let arrow = {
    width: arroww,
    height: arrowh,
    baseImage: createImage("trianglerotated.png"),
}

let formehexagonale = {
    width: 150,
    height: 150,
    img: createImage("hexagonal.png"),
}

let bg = {
    width: 1000,
    height: 1000,
    img: createImage("bg.png"),
}

let center = {
    x: boardw / 2,
    y: boardh / 2,
}

//Endgame screen variable
let gameover = false;
let gameoverscreen = createImage("HEXAMORT.png");

//Score Variable
let score = 0;
let scorecounter = 0;

//Rotation Variable
let rotationspeed = 0.1;
let globalrotation = 0;

//Input system
let keys = {};

// FPS
let lastFrameTime = 0;
let fps = 0;
let fpsCounter;

// Obstacle
let spawncd = 0;
let obstaclelist = [];
let obstaclespeed = 15;
let spawntime = 40;

//Stocker les image avec les couleurs modifiées
let modulatedBgImages = [];
let modulatedHexImages = [];

let musique;

//Listener touche
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

function preCalculateImages() {
    const numColors = 60;
    for (let i = 0; i < numColors; i++) {
        const hue = i / numColors;
        const [r, g, b] = hslToRgb(hue, 1, 0.5);
        const color = rgbToHex(r, g, b);

        modulatedBgImages.push(modulate(bg.img, color));
        modulatedHexImages.push(modulate(formehexagonale.img, color));
    }
}

class hexamur {
    constructor(patern, size = 1200) {
        this.patern = patern;
        this.size = size;
        this.img = createImage("hex2.png");
        this.rotation = this.patern * Math.PI/3;
    }

    drawing() {
        context.save();
        context.rotate(this.rotation);
        context.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        context.restore();
    }

    resize() {
        this.size -= obstaclespeed;
    }
}

function initGame() {
    // Initialisation avec l'image de base
    modulatedArrowImg = arrow.baseImage;

    // Lancer la boucle de mise à jour du jeu
    requestAnimationFrame(update);
}

function calculateFPS(timestamp) {
    if (lastFrameTime) {
        const deltaTime = timestamp - lastFrameTime;
        fps = Math.round(1000 / deltaTime);
        fpsCounter.textContent = "FPS: " + fps;
    }
    lastFrameTime = timestamp;
    scorecounter.textContent = "Score: " + score;
}

function updateControls(deltaTime) {
    let updateRotationSpeed = rotationspeed * deltaTime;
    if (keys[keybind.left]) {
        arrowrot -= updateRotationSpeed;
    }
    else if (keys[keybind.right]) {
        arrowrot += updateRotationSpeed;
    }
}

function spawning(deltaTime) {
    if (spawncd >= spawntime) {
        obstaclelist.push(new hexamur(randomIntFromInterval(0, 5)));
        spawncd = 0;
    }
    spawncd += 1*deltaTime;
}

function collision() {
    if (obstaclelist.length === 0) return;

    let currentObstacle = obstaclelist[0];
    let obstacleSize = currentObstacle.size;
    let obstacleAngle = currentObstacle.rotation;


    let distanceToCenter = obstacleSize / 2;
    const proximityFromCenter = 100;

    if (distanceToCenter <= proximityFromCenter) {
        let arrowAngle = (arrowrot + Math.PI / 2) % (2 * Math.PI);
        if (arrowAngle < 0) arrowAngle += 2 * Math.PI;
        let newArrowAngle = Math.floor(arrowAngle / (Math.PI / 3)) % 6;

        const angleTolerance = 0.5;

        if (Math.abs(newArrowAngle - obstacleAngle) <= angleTolerance) {
            score += 1;
            obstaclelist.shift();
        } else {
            gameover = true;
        }
    }
}


function updateColors() {
    colorcd += 1;
    if (colorcd === maxcolor) {
        colorcd = 0;
        colorwheel += 0.001;
        if (colorwheel > 1) colorwheel = 0;

        const index = Math.floor(colorwheel * 60);
        modulatedBgImg = modulatedBgImages[index];
        modulatedhexagone = modulatedHexImages[index];
    }
}

function drawAll() {
    context.clearRect(0, 0, board.width, board.height);
    context.save();
    context.translate(center.x, center.y);
    context.rotate(globalrotation);
    drawbg();
    drawArrow();
    drawhexagonal();
    obstaclelist.forEach(function (item) { item.drawing(); });
    context.restore();

    if (gameover === true) {
        if (musiqueoption == true) {musique.pause();}
        context.drawImage(gameoverscreen, 0, 0, boardh, boardw);
    }
}

//Boucle principale de gameplay
function update(timestamp) {
    if (lastTime === 0) {
        lastTime = timestamp;
    }
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    calculateFPS(timestamp);

    if (keys[keybind.menu]){
        musique.pause();
        restart();
        showMenu();
    }

    if (isMenuActive || isOptionsActive) {
        requestAnimationFrame(update);
        return;
    }

    //Contrôles
    if (gameover === false) {
        const baseFrameTime = 1 / 60;
        const normalizedDeltaTime = deltaTime / baseFrameTime;

        const baseObstacleSpeed = 15;

        obstaclespeed = baseObstacleSpeed * normalizedDeltaTime;

        console.log("obstaclespeed: ", obstaclespeed);
        console.log("spawntime: ", spawntime);

        if (musiqueoption == true) {musique.play();}
        updateControls(normalizedDeltaTime);
        collision();
        spawning(normalizedDeltaTime);
        updateColors();
        obstaclelist.forEach(function (item) { item.resize(); });
        globalrotation += 0.01*normalizedDeltaTime;
        drawAll();
    }
    else{
        if (keys[keybind.restart]) {
            restart();
        }
    }

    requestAnimationFrame(update);
}

function drawArrow() {
    context.save();
    context.rotate((arrowrot + Math.PI / 2));
    context.drawImage(modulatedArrowImg, -arrow.width / 2, -arrow.height / 2 - 85, arrow.width, arrow.height);
    context.restore();
}

function drawhexagonal() {
    context.drawImage(modulatedhexagone, -formehexagonale.width / 2, -formehexagonale.height / 2, formehexagonale.width, formehexagonale.height);
}

function drawbg() {
    context.drawImage(modulatedBgImg, -bg.width / 2, -bg.height / 2, bg.width, bg.height);
}

function modulate(image, color) {
    // Crée un canvas temporaire pour dessiner l'image (sans je sais pas pouquoi j'ai un problème de taille d'image)
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');

    tempCanvas.width = image.width;
    tempCanvas.height = image.height;

    // Dessine l'image sur le canvas temporaire
    tempContext.drawImage(image, 0, 0);

    // Applique une couleur par pixel
    const imageData = tempContext.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    const [r, g, b] = hexToRgb(color);

    // Applique le filtre de couleur
    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] * r) / 255;     // Red
        data[i + 1] = (data[i + 1] * g) / 255; // Green
        data[i + 2] = (data[i + 2] * b) / 255; // Blue
    }

    tempContext.putImageData(imageData, 0, 0);

    // Crée une nouvelle image à partir du canvas modifié
    const modulatedImage = new Image();
    modulatedImage.src = tempCanvas.toDataURL();

    return modulatedImage;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function restart() {
    gameover = false;
    score = 0;
    arrowrot = -Math.PI / 2;
    spawncd = 0;
    colorwheel = 0;
    colorcd = maxcolor - 1;
    obstaclelist = [];
    globalrotation = 0;
    if (musiqueoption == true) {musique.currentTime = 0}
}

function createImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // Shade of gray
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
