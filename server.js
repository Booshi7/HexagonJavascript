const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Utilisez express.static pour servir les fichiers statiques du dossier 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'files/main.html'));
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
