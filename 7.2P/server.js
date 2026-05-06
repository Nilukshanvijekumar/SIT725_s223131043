const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Real-time feature (original variation):
 * - Users pick a "room" (e.g. SIT725) and a display name.
 * - Server broadcasts presence + "typing" + messages within that room only.
 * - Server also tracks and emits live room member counts.
 */
const roomCounts = new Map(); // room -> number

function bumpRoom(room, delta) {
  const next = Math.max(0, (roomCounts.get(room) || 0) + delta);
  if (next === 0) roomCounts.delete(room);
  else roomCounts.set(room, next);
  return next;
}

io.on('connection', (socket) => {
  socket.data.room = null;
  socket.data.name = null;

  socket.on('room:join', ({ room, name }) => {
    const safeRoom = typeof room === 'string' && room.trim() ? room.trim().slice(0, 32) : 'lobby';
    const safeName = typeof name === 'string' && name.trim() ? name.trim().slice(0, 24) : 'Anonymous';

    if (socket.data.room) {
      socket.leave(socket.data.room);
      bumpRoom(socket.data.room, -1);
      io.to(socket.data.room).emit('room:count', {
        room: socket.data.room,
        count: roomCounts.get(socket.data.room) || 0
      });
    }

    socket.data.room = safeRoom;
    socket.data.name = safeName;

    socket.join(safeRoom);
    const count = bumpRoom(safeRoom, +1);

    socket.emit('room:joined', { room: safeRoom, name: safeName });
    io.to(safeRoom).emit('room:count', { room: safeRoom, count });
    socket.to(safeRoom).emit('presence:joined', { name: safeName });
  });

  socket.on('chat:message', (payload) => {
    if (!socket.data.room) return;
    const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
    if (!text) return;

    io.to(socket.data.room).emit('chat:message', {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: Date.now(),
      room: socket.data.room,
      name: socket.data.name || 'Anonymous',
      text: text.slice(0, 400)
    });
  });

  socket.on('chat:typing', (payload) => {
    if (!socket.data.room) return;
    const isTyping = Boolean(payload?.isTyping);
    socket.to(socket.data.room).emit('chat:typing', {
      name: socket.data.name || 'Anonymous',
      isTyping
    });
  });

  socket.on('disconnect', () => {
    if (!socket.data.room) return;
    const room = socket.data.room;
    const name = socket.data.name || 'Anonymous';

    bumpRoom(room, -1);
    io.to(room).emit('room:count', { room, count: roomCounts.get(room) || 0 });
    socket.to(room).emit('presence:left', { name });
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(
      `Port ${PORT} is already in use. Try a different port, e.g. set PORT=3001 then run npm start.`
    );
    process.exit(1);
  }
  throw err;
});
