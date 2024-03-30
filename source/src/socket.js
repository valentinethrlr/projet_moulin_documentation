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

envoiMoulin(eval(`this.joueur${this.actuel_joueur}`), "info", {"but" : "mouvement", "pion" : this.current_pion, "case" : `case${caseNumber}`, "sonTour" : "non"})
envoiMoulin(eval(`this.joueur${this.autre_joueur}`), "info", {"but" : "mouvement", "pion" : this.current_pion, "case" : `case${caseNumber}`, "sonTour" : "oui"})

switch (message["but"]) {
  case "id":
      document.getElementById("optionsCreer").style.display = "none"
      document.getElementById("votreId").innerText += message["id"]
      votreId = message["id"]
      document.getElementById("creationId").style.display = "block"
      break
  
  case "fausseId":
      document.getElementById("idFausse").innerText = "Cette partie n'existe pas."
      break

  case "commencer1":
      document.getElementById("creationId").style.display = "none"
      document.getElementById("jeuTotal").style.display = "block"
      enLigne = true
      break

  case "commencer2":
      document.getElementById("login").style.display = "none"
      document.getElementById("jeuTotal").style.display = "block"  
      enLigne = true
      break

  case "temps":
      if (!(message["temps"] == "pasTimer")) {
          document.getElementById("tempsb").innerText = `${message["temps"].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00`
          document.getElementById("tempsn").innerText = `${message["temps"].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:00`
          document.getElementById("tempsb").style.display = "block"
          document.getElementById("tempsn").style.display = "block"
      } 
      break
      
  case "couleur":     
      if (message["couleur"] == "b") {
          document.getElementById("indication").innerText = "C'est à vous de jouer !"
      } else {
          document.getElementById("indication").innerText = "C'est à l'adversaire de commencer !"
      }
      break

  case "mouvement":
      mouvementLigne(message["pion"], message["case"])
      if (message["sonTour"] == "oui") {
          document.getElementById("indication").innerText = "C'est à vous de jouer !"
      } else {
          document.getElementById("indication").innerText = "C'est à l'adversaire de jouer !"
      }
      break

  case "chrono":
      clearInterval(chornometreLigne)
      timerLigne(message["temps"], message["couleurJoueur"])
      break

  case "fin":
      finEnLigne(message["gagnant"])
      break

  case "supprimeAnimation":
      supprimeAnimationLigne()
      break

  case "animation":
      document.getElementById(message["pion"]).classList.add("animationSelection")
      break

  case "moulin":
      document.getElementById("indication").innerText = "MOULIN !"
      break

  case "elimine":
      elimineLigne(message["pion"], message["couleur"], message["sonTour"])
      break

  case "deconnecte":
      document.getElementById("login").style.display = "none"
      document.getElementById("jeuTotal").style.display = "none"
      document.getElementById("deconnexion").innerText = "Votre adversaire s'est déconnecté"
      document.getElementById("deconnexion").style.marginTop = "100px";
      document.getElementById("deconnexion").style.display = "block"
      break
}