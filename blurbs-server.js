const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

/*
PLAYER INFO:

- Username
- Blip coords
*/

const clientMap = new Map();

function getRandomInt(min, max) {
    min = Math.ceil(min);   // Ensure min is an integer
    max = Math.floor(max);  // Ensure max is an integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received: %s', message);
    let data = JSON.parse(message);
    
    if (data?.joinName)
    {
        let playerInfo = {
            username: data.joinName,
            blipCoords: {
                x: 0.0,
                y: 0.0,
                z: 0.0
            },
            client: ws
        };
        clientMap.set(data.joinName, playerInfo);
        console.log(data.joinName + " has joined the game.")
        console.log(clientMap);
    }
    else if (data?.updateName)
    {
        let playerInfo = clientMap.get(data.updateName);

        playerInfo.blipCoords = data.blipCoords;

        ws.send(JSON.stringify({serverInfo: clientMap}));
    }

    /*if (data?.setBlurbsPass)
    {
        hostPass = data.setBlurbsPass;
    }*/
  });

  ws.on('close', () => {
    let entryToDelete = "";
    // Use for...of to iterate over map values directly
    for (const [key, value] of clientMap.entries()) { // Changed myMap to lobbyMap
        if (value == ws)
        {
            entryToDelete = key;
            break;
        }
    }

    if (entryToDelete != "")
        clientMap.delete(entryToDelete);
  });
});