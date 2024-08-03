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

document.getElementById("musiqueButton").addEventListener('click', function() {
    activateMusique();
});

document.getElementById("vitesseButton").addEventListener('click', function() {
    activateVitesse();
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

function activateMusique() {
    musiqueoption = !musiqueoption
    if (musiqueoption == true)
    {
        document.getElementById('musiqueButton').textContent = "Musique : On"
    }
    else {
        document.getElementById('musiqueButton').textContent = "Musique : Off"
    }
}

function activateVitesse() {
    if (rotationspeed == 0.10)
    {
        rotationspeed = 0.15;
        document.getElementById('vitesseButton').textContent = "Fast Arrow"
    }
    else {
        rotationspeed = 0.10;
        document.getElementById('vitesseButton').textContent = "Slow Arrow"
    }
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

        input.addEventListener('keydown', function(e) {
            keybind[key] = e.key
            input.value = keybind[key];
            e.preventDefault();
        });

        div.appendChild(label);
        div.appendChild(input);
        optionsContainer.appendChild(div);
    }
}
