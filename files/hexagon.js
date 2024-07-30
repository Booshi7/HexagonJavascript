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
let gameoverscreen
let score = 0;
let scorecounter = 0
let rotationspeed = 0.1;
let globalrotation = 0;
let keys = {};

// FPS
let lastFrameTime = 0;
let fps = 0;
let fpsCounter;

let spawncd = 0
let spawntime = 40
let obstaclelist = []
let obstaclespeed = 15  

let musique

//Touches
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    //console.log(e.key)
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});



class hexamur {
    constructor(patern) {
        this.patern = patern;
        this.size = 1200;
        this.img = new Image();
        this.img.src = "hex1.png";
        this.rotation = this.patern * Math.PI/3;

    }

    drawing() {
        //this.size -= obstaclespeed
        context.save();
        context.rotate(this.rotation);
        context.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        context.restore();
    }

    resize() {
        this.size -= obstaclespeed
    }
}


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
    //penis = new hexamur(5)

    gameoverscreen = new Image()
    gameoverscreen.src = "HEXAMORT.png"

    fpsCounter = document.getElementById("fpsCounter");
    scorecounter = document.getElementById("Score");

    musique = new Audio("584398.mp3")
    

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
    scorecounter.textContent = "Score: " + score

    
    //Contrôles
    if (gameover == false) {
        musique.play()
    if (keys['q']) {
        arrowrot -= rotationspeed;
        //modulatedArrowImg = modulate(arrow.baseImage, '#FF0000');
    }
    else if (keys['d']) {
        arrowrot += rotationspeed;
        //modulatedArrowImg = modulate(arrow.baseImage, '#012ef8');
    }
    else if (keys['z']) {
        //modulatedArrowImg = modulate(arrow.baseImage, '#ffffff');
        //console.log(spawncd)
    }

    if (spawncd % spawntime == 0) {
        obstaclelist.push(new hexamur(randomIntFromInterval(0, 5)))
    }
    if (spawncd >= Math.floor(((1050/obstaclespeed)/10)*8)) {
        let variablequisertarien = Math.floor((spawntime/20) * 19)
        if ((spawncd-Math.floor(1050/obstaclespeed)) % spawntime < 0) {variablequisertarien = -Math.floor(spawntime/10)}
        //console.log((spawncd-Math.floor(1050/obstaclespeed)) % spawntime, variablequisertarien)
        if ((spawncd-Math.floor(1050/obstaclespeed)) % spawntime == variablequisertarien) {
            //console.log(51545)
            let checkpos = Math.floor(((arrowrot+Math.PI/2)/ (Math.PI/3)) % 6)
            if (checkpos <0) {checkpos += 6}
            //console.log(     checkpos,           Math.floor(obstaclelist[0].rotation))
            if (checkpos != Math.floor(obstaclelist[0].rotation)){
                gameover = true
            }
            else {score += 1}
        }
        if ((spawncd-Math.floor(1050/obstaclespeed)) % spawntime == 0) {
            //let checkpos = Math.floor(((arrowrot+Math.PI/2)/ (Math.PI/3)) % 6)
            //if (checkpos <0) {checkpos += 6}
            //console.log(     checkpos,           Math.floor(obstaclelist[0].rotation))
            //if (checkpos != Math.floor(obstaclelist[0].rotation)){
            //    gameover = true
            //}
            obstaclelist.splice(0, 1)
        }

    }
    spawncd += 1

    colorcd += 1
    if (colorcd == maxcolor){
        colorcd = 0
        colorwheel += 0.00
        colorwheel = Math.floor(colorwheel*1000)/1000
        if (colorwheel > 1){colorwheel = 0}
        let rgbvalue =  hslToRgb(colorwheel, 1, 0.5)
        //console.log(colorwheel,rgbToHex(rgbvalue[0], rgbvalue[1],rgbvalue[2]))
        modulatedBgImg = modulate(bg.img, rgbToHex(rgbvalue[0], rgbvalue[1],rgbvalue[2]))
        modulatedhexagone = modulate(formehexagonale.img, rgbToHex(rgbvalue[0], rgbvalue[1],rgbvalue[2]))
    }
    obstaclelist.forEach(function (item, index) { item.resize() });
    globalrotation += 0.01;
    }
    // Draw + global rotation
    context.clearRect(0, 0, board.width, board.height);
    context.save()
    context.translate(center.x, center.y)
    context.rotate(globalrotation)
    drawbg();
    drawArrow();
    drawhexagonal();
    obstaclelist.forEach(function (item, index) { item.drawing() });
    context.restore();
    //penis.drawing()

    if (gameover == true) {
        musique.pause()
        context.drawImage(gameoverscreen, 0, 0, boardh, boardw)
        if (keys[' ']) {
            restart()
        }
    }
    requestAnimationFrame(update);
}

function drawArrow() {
    context.save();
    context.rotate((arrowrot + Math.PI / 2) * 1);
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

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(red, green, blue) {
    const rgb = (red << 16) | (green << 8) | (blue << 0);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  }

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
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