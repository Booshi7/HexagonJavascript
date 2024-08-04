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

    gameoverscreen.src = "image/HEXAMORT.png";

    // Compteur FPS et Score
    fpsCounter = document.getElementById("fpsCounter");
    scorecounter = document.getElementById("Score");

    // Musique
    musique = new Audio("music/584398.mp3");

    // Pré-calculer les images
    preCalculateImages();

    document.getElementById('loading').style.display = 'none';
    document.getElementById('board').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('Score').style.display = 'block';
    document.getElementById('fpsCounter').style.display = 'block';
    document.getElementById('menu').style.display = 'block';

    initGame();
};