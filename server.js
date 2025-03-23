const { Server } = require('socket.io');

const rooms = [
	{ name: 'room1', players: new Set() },
	{ name: 'room2', players: new Set() },
];
const io = new Server(3000, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
	},
});

const broadcastRooms = () => {
	io.emit(
		'updateRooms',
		rooms.map((room) => ({ name: room.name, numberOfPlayers: room.players.size }))
	);
};

io.on('connection', (socket) => {
	console.log('Connection');
	broadcastRooms();
	socket.on('joinRoom', (roomName, userName) => {
		console.log(roomName, socket.id, userName);
		const room = rooms.find((room) => room.name === roomName);
		room.players.add(userName);
		broadcastRooms();
		console.log(room);
	});
});
