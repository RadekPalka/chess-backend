const { Server } = require("socket.io");

const rooms =[{name: "room1", players: []}, {name: 'room2', players: []}]
const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const broadcastRooms = () => {
  io.emit("updateRooms", rooms);
};

io.on('connection', socket=>{
  socket.emit("updateRooms", rooms.map(room=> ({name: room.name, numberOfPlayers: room.players.length})));
  socket.on("joinRoom", (roomName)=>{
    console.log(roomName, socket.id)
  })
})