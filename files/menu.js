// Variable de navigation
let isMenuActive = true;
let isOptionsActive = false;

// Listener touches des boutons du menu
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
    document.getElementById('options').style.display = 'none';
    isMenuActive = true;
    isOptionsActive = false;
}

function showOptions() {
    document.getElementById('options').style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    isMenuActive = false;
    isOptionsActive = true;
    generateKeybindOptions();
}

function showGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('board').style.display = 'block';
    isMenuActive = false;
    isOptionsActive = false;
}

// Génération dynamique des options de keybind
function generateKeybindOptions() {
    const optionsContainer = document.getElementById('keybind-options');
    optionsContainer.innerHTML = ''; // Clear previous options

    for (const key in keybind) {
        const div = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');

        label.setAttribute('for', `keybind-${key}`);
        label.setAttribute('id', `keybind-label`);
        label.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}:`;

        input.setAttribute('type', 'text');
        input.setAttribute('id', `keybind-input`);
        input.setAttribute('value', keybind[key]);

        // Ajout d'un écouteur d'événement pour mettre à jour keybind
        input.addEventListener('input', function(e) {
            keybind[key] = e.target.value;
        });

        div.appendChild(label);
        div.appendChild(input);
        optionsContainer.appendChild(div);
    }
}
