let board;
let boardh = 690;
let boardw = 690;
let context;

let arrowh = 20;
let arroww = 20;
let arrowrot = -Math.PI / 2;
let arrowimg;

let arrow = {
    width: arroww,
    height: arrowh,
}

let center = {
    x: boardw / 2,
    y: boardh / 2,
}

let gameover = false;
let score = 0;
let keys = {};

// FPS
let lastFrameTime = 0;
let fps = 0;
let fpsCounter;

window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardh;
    board.width = boardw;
    context = board.getContext("2d");

    arrowimg = document.getElementById("trianglerotated");
    arrowimg.onload = function() {
        requestAnimationFrame(update);
    }

    fpsCounter = document.getElementById("fpsCounter");

    drawArrow();
    requestAnimationFrame(update);
}

function update(timestamp) {
    if (lastFrameTime) {
        const deltaTime = timestamp - lastFrameTime;
        fps = Math.round(1000 / deltaTime);
        fpsCounter.textContent = "FPS: " + fps;
    }
    lastFrameTime = timestamp;

    context.clearRect(0, 0, board.width, board.height);

    if (keys['q']) {
        arrowrot -= 0.1;
    } else if (keys['d']) {
        arrowrot += 0.1;
    }

    drawArrow();
    requestAnimationFrame(update);
}

function drawArrow() {
    context.save();
    context.translate(center.x, center.y);
    context.rotate((arrowrot + Math.PI/2)*1);
    context.drawImage(arrowimg, -arrow.width / 2, -arrow.height / 2 -100, arrow.width, arrow.height);
    //context.translate(Math.cos(arrowrot)*100, Math.sin(arrowrot)*100)
    context.restore();
}
