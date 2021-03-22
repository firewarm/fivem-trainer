const memory = require('memoryjs'),
  // keyboard = require("asynckeystate"),
  // sleep = require('sleep'),
  // jsonfile = require('jsonfile'),
  // open = require('opener'),
  // request = require('request'),
  express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  path = require('path');
// robot = require("robotjs");



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const offsets = {
  localplayer: 0x08,
  world: 0x21804A0,
  vec3: 0x90,
  health: 0x280,
  playerinfo: 0x1078
};

let baseAddr, handle;

const state = {
  injected: false
};

// Easy access to base locs
const localPlayer = () => baseAddr + offsets.localplayer;
const playerVec3 = () => localPlayer() + offsets.vec3;
const playerHealth = () => localPlayer() + offsets.health;

// Events that can be sent from client to execute
const events = {
  inject: () => {
    const process = memory.openProcess("GTA5.exe");
    state.injected = process && process.szExeFile === "GTA5.exe";
    baseAddress = state.injected ? process.modBaseAddr : null;
    handle = state.injected ? process.handle : null;
  },


  read_health: () => {
    const health = memory.readMemory(handle, playerHealth(), "int");
    console.log(health);
  }
}

const handleEvent = (event, value) => {
  console.log(event, value);
  if (!event || !events.hasOwnProperty(event)) return;
  events[event](value);
  io.emit("state", state);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CHEAT FUNCTIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function read_health() {

  const health = memory.readMemory(playerHealth(), "int");
  console.log(health)
  // var dwlocalPlayer = memory.readMemory(clientDLL_base + offset.dwlocalPlayer, "int");
  // var flashMaxAlpha = memory.readMemory(dwlocalPlayer + offset.flashMaxAlpha, "float");

  // if (flashMaxAlpha > 0.0) {
  //   memory.writeMemory(dwlocalPlayer + offset.flashMaxAlpha, 0.0, "float");
  // }

};



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SOCKET AND WEBVIEW
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/hack.html');
});

io.on('connection', (socket) => {
  socket.on("event", handleEvent);
});
http.listen(3000, () => {
  console.log("Cheat booted up");
});
