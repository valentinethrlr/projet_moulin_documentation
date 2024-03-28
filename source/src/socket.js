//initialisation côté serveur
const httpServer = require("http").createServer();
var moulinController = new (require("./moulin/moulin.js"))
var morpionController = new (require("./morpion/morpion.js"))

//initialiser le serveur
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://vgames.totifle.ch",
      methods: ["GET", "POST"]
    }
});

const moulinWorkspace = io.of("moulin")
const morpionWorkspace = io.of("morpion")
  
moulinWorkspace.on("connect", (socket) => {
  moulinController.connect(socket)
})

morpionWorkspace.on("connect", (socket) => {
  morpionController.connect(socket)
})

httpServer.listen(25565)

//initialisation côté client
socket = io("http://totifle.ch:25565/moulin")

io.on("connection", (socket) => {
    socket.emit("evenement", "message");
});

//envoyer un message à un client particulier
global.envoiMoulin = function envoiMoulin(client, titre, message){
    moulinWorkspace.to(client).emit(titre, message);
}

//recevoir un message
socket.on("evenement", (message) => {
    // ...
});

//fonctions commentées

function creerLigne() {
  if (!(dureeJoueur == null) && !(couleurJoueur == null)) {
      socket.emit("setup", {"but": "creationId", "duree": dureeJoueur, "couleur": couleurJoueur})
  } else {
      document.getElementById("incompletude").style.display = "block"
  }
}