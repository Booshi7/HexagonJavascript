let board;
let boardh = 690;
let boardw = 690;
let context;

let arrowh = 20;
let arroww = 20;
let arrowrot = -Math.PI / 2;
let arrowimg;
let modulatedArrowImg;
let modulatedBgImg;
let modulatedhexagone;
let colorwheel = 0;
let maxcolor = 3
let colorcd = maxcolor -1;

//Variable de navigation
let isMenuActive = true;
let isOptionsActive = false;

//KeyBind
keybind = {
    "left": 'q',
    "rigth": 'd',
    "restart": 'space',
    "menu":'z'
}

let arrow = {
    width: arroww,
    height: arrowh,
    baseImage: createImage("trianglerotated.png")
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
let scorecounter = 0

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
let spawncd = 0
let spawntime = 40
let obstaclelist = []
let obstaclespeed = 15

//Stocker les image avec les couleurs modifiées
let modulatedBgImages = [];
let modulatedHexImages = [];

let musique

//Listener touche
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

document.getElementById('playButton').addEventListener('click', function() {
    showGame();
});

document.getElementById('optionsButton').addEventListener('click', function() {
    showOptions();
});

document.getElementById('backButton').addEventListener('click', function() {
    showMenu();
});

function showMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('board').style.display = 'none';
    isMenuActive = true;
    isOptionsActive = false;
}

function showOptions() {
    document.getElementById('options').style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    isMenuActive = false;
    isOptionsActive = true;
}

function showGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('board').style.display = 'block';
    isMenuActive = false;
    isOptionsActive = false;
}

function preCalculateImages() {
    return new Promise((resolve) => {
        const numColors = 60; // Nombre réduit de couleurs
        let loaded = 0;

        function checkCompletion() {
            loaded++;
            if (loaded === numColors * 2) { // 2 images par couleur
                resolve(); // Toutes les images sont pré-calculées
            }
        }

        for (let i = 0; i < numColors; i++) {
            const hue = i / numColors;
            const [r, g, b] = hslToRgb(hue, 1, 0.5);
            const color = rgbToHex(r, g, b);

            const modulatedBgImage = modulate(bg.img, color);
            modulatedBgImage.onload = checkCompletion;
            modulatedBgImages.push(modulatedBgImage);

            const modulatedHexImage = modulate(formehexagonale.img, color);
            modulatedHexImage.onload = checkCompletion;
            modulatedHexImages.push(modulatedHexImage);
        }
    });
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
        this.size -= obstaclespeed
    }
}


//Creation of our application
window.onload = function() {
    // Afficher l'écran de chargement
    document.getElementById('loading').style.display = 'flex';

    // Configuration du plateau de jeu
    board = document.getElementById("board");
    board.height = boardh;
    board.width = boardw;
    context = board.getContext("2d");

    // Configuration du personnage
    arrowimg = document.getElementById("trianglerotated");
    arrow.baseImage.src = arrowimg.src;

    formehexagonale.img = document.getElementById("hexagonal");
    bg.img = document.getElementById("bg");
    gameoverscreen.src = "HEXAMORT.png";

    // Compteur FPS et Score
    fpsCounter = document.getElementById("fpsCounter");
    scorecounter = document.getElementById("Score");

    // Musique
    musique = new Audio("584398.mp3");

    // Pré-calculer les images
    preCalculateImages().then(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('board').style.display = 'block';
        document.getElementById('Score').style.display = 'block';
        document.getElementById('fpsCounter').style.display = 'block';
        document.getElementById('menu').style.display = 'block';
        initGame();
    });
};

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

function updateControls() {

        if (keys[keybind.left]) {
            arrowrot -= rotationspeed;
        }
        else if (keys[keybind.rigth]) {
            arrowrot += rotationspeed;
        }
}

function spawning() {
    if (spawncd % spawntime === 0) {
        obstaclelist.push(new hexamur(randomIntFromInterval(0, 5)));
    }
    spawncd += 1;
}

function collision(){
    if (spawncd >= Math.floor(((1050/obstaclespeed)/10)*8)) {
        let obstacle = spawncd - Math.floor(1050 / obstaclespeed);
        let offset = Math.floor((spawntime/20) * 19);
        let checkPoint = obstacle % spawntime;

        if (checkPoint === offset || checkPoint === -Math.floor(spawntime / 10)){
            let checkpos = Math.floor((arrowrot + Math.PI / 2) / (Math.PI / 3)) % 6;
            if (checkpos < 0){
                checkpos += 6;
            }

            if (checkpos !== Math.floor(obstaclelist[0].rotation)) {
                gameover = true;
            } else {
                score += 1;
            }
        }

        if (checkPoint === 0) {
            obstaclelist.shift();
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

function drawAll(){
    context.clearRect(0, 0, board.width, board.height);
    context.save()
    context.translate(center.x, center.y)
    context.rotate(globalrotation)
    drawbg();
    drawArrow();
    drawhexagonal();
    obstaclelist.forEach(function (item, index) { item.drawing() });
    context.restore();

    if (gameover === true) {
        musique.pause()
        context.drawImage(gameoverscreen, 0, 0, boardh, boardw)
        if (keys[' ']) {
            restart()
        }
    }
}

//Boucle principale de gameplay
function update(timestamp) {

    calculateFPS(timestamp);

    if (isMenuActive || isOptionsActive) {
        requestAnimationFrame(update);
        return;
    }

    //Contrôles
    if (gameover === false) {
        musique.play();
        updateControls();
        collision();
        spawning();
        updateColors();
        obstaclelist.forEach(function (item, index) { item.resize() });
        globalrotation += 0.01;
    }

    drawAll();

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

    // Dessine l'image de base sur le canvas temporaire
    tempContext.drawImage(image, 0, 0);

    // Récupère les données des pixels de l'image
    const imageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    // Parse la couleur
    const [r, g, b] = hexToRgb(color);

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

function hslToRgb(h, s, l) {
    if (s === 0) return [l, l, l].map(v => Math.round(v * 255));

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const hue2rgb = t => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    return [
        hue2rgb(h + 1 / 3),
        hue2rgb(h),
        hue2rgb(h - 1 / 3)
    ].map(v => Math.round(v * 255));
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createImage(src) {
    let img = new Image();
    img.src = src;
    return img;
}

function restart(){
    colorwheel = 0;
    maxcolor = 3
    colorcd = maxcolor -1;
    score = 0
    gameover = false
    globalrotation = 0;
    obstaclelist = []
    spawncd = 0
    arrowrot = -Math.PI / 2
    musique.currentTime = 0
}