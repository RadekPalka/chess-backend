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
	broadcastRooms();
	socket.on('joinRoom', (roomName, userName) => {
		const room = rooms.find((room) => room.name === roomName);
		room.players.add(userName);

		const clients = io.sockets.adapter.rooms.get(room.name);
		if (!clients || clients.size < 2) socket.join(room.name);
		if (clients.size === 2) {
			io.to(room.name).emit('full-room', Array.from(room.players));
		}
		broadcastRooms();
	});
});
