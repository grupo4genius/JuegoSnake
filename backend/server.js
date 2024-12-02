const io = require('socket.io')();
const { initGame, gameLoop, getUpdatedVelocity } = require ('./game');
const { FRAMERATE } = require('./constants');
const { makeid } = require('./utils');

const state ={}; /* Estado inicial vacio */
const clientRooms = {}; /*Sala al iniciar vacio */

io.on('connection', client => {
    client.on('keydown', handleKeydown);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);

    /* Handle JoinGame */
    function handleJoinGame(roomName){
        const room = io.sockets.adapter.rooms[roomName];
        
        let allUsers;
        if (room) {
            allUsers = room.sockets;
        }

        let numClients = 0;
        if (allUsers){
            numClients = object.keys(allUsers).lenght;
        }

        if (numClients === 0){
            client.emit('unknownCode');
            return;
        } else if (numClients = 1){
            client.emit('tooManyPlayers');
            return ;
        }

        clientRooms[client.id] = roomName;
        client.join(roomName);
        client.number = 2;
        client.emit('init', 2);
        startGameInterval(roomName);
    }

    /* Handle New Game */
    function handleNewGame(){
        let roomName = makeid(5);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);

        state[roomName] = initGame();
        client.join(roomName);
        client.number = 1;
        client.emit('init', 1);
    }

    /* Handle Key Down */
    function handleKeydown(keyCode){
        const roomName = clientRooms[client.id];
        if (!roomName){
            return;
        }
        try{
            keyCode = parseInt(keyCode);
        }catch(e){
            console.error(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);
        if (vel){
            state[roomName].players[client.number - 1].vel = vel;
        }
    }
});

function startGameInterval(roomName){
    const intervalId = setInterval(() =>{
    const winner = gameLoop(state[roomName]);

    if (!winner){
        emitGameState(roomName, state[roomName]);
        } else{
            emitGameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000 / FRAMERATE);
}

function emitGameState(room, gameState){
    io.sockets.in(room)
    .emit('gameState', JSON.stringify({gameState}));
}

function emitGameOver(room, winner){
    io.sockets.in(room)
    .emit('gameOver', JSON.stringify({winner}));
}

io.listen(process.env.PORT || 3000);





