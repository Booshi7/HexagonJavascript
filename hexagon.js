let board;
let boardh = 690;
let boardw = 690;
let context;

let arrowh = 500;
let arroww = 500;
let arrowrot = -Math.PI / 2;
let arrowimg;

let arrow = {
    width: arroww,
    height: arrowh,
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
    arrowimg.style.filter = "grayscale(100%)"
    formehexagonale.img = document.getElementById("hexagonal")

    bg.img = document.getElementById("bg");


    fpsCounter = document.getElementById("fpsCounter");

    drawbg()
    drawhexagonal();
    drawArrow();
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
    } else if (keys['d']) {
        arrowrot += rotationspeed;
    }
    // Draw + global rotation
    globalrotation += 0.00;
    context.save()
    context.translate(center.x, center.y)
    context.rotate(globalrotation)
    drawbg()
    drawArrow();
    drawhexagonal();
    context.restore();

    requestAnimationFrame(update);
}

function drawArrow() {
    context.save();
    //context.translate(center.x, center.y);
    context.rotate((arrowrot + Math.PI/2)*1);
    context.filter = "saturate(4)"
    context.drawImage(arrowimg, -arrow.width / 2, -arrow.height / 2 -100, arrow.width, arrow.height);
    //context.translate(Math.cos(arrowrot)*100, Math.sin(arrowrot)*100)
    context.restore();
}

function drawhexagonal() {
    //context.save();
    context.drawImage(formehexagonale.img, -formehexagonale.width /2, -formehexagonale.height/2, formehexagonale.width, formehexagonale.height);
    //context.restore();
}

function drawbg() {
    //context.save();
    context.drawImage(bg.img, -bg.width/2, -bg.height/2, bg.width, bg.height);
    //context.restore();
}
