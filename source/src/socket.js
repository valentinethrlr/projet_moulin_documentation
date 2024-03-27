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

io.on("connection", (socket) => {
    socket.emit("evenement", "message");
  });

