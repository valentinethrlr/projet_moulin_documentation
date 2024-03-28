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
};

connect(socket){

  socket.on("setup", (message) => {
    if (message["but"] == "creationId") {
      let id=Math.floor((Math.random()) * 1000000)
      while (id in this.parties) {
        id=Math.floor((Math.random()) * 1000000)
      }
      const duree = Number(message["duree"])
      const couleur = message["couleur"]
      this.joueurs[socket.id] = id
      this.parties[id] = new this.PartieMoulin(id, socket.id, duree, couleur)
      socket.emit("info", {"but": "id", "id": id})
      
    } else if (message["but"] == "idConnexion") {
      if (message["id"] in this.parties && this.parties[message["id"]].joueur2 == null) {
        this.joueurs[socket.id] = message["id"]
        this.parties[message["id"]].joueur2 = socket.id
        this.commencerPartie(message["id"])   
      } else {
        socket.emit("info", {"but" : "fausseId"})
      } 
    } else if (message["but"] == "case") {
      this.parties[message["id"]].joue(message["case"], socket.id)
    } else if (message["but"] == "pion") {
      this.parties[message["id"]].selectionne(message["pion"], socket.id)
    }
  })
};
