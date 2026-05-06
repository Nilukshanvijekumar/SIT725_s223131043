/* global io */

const connPill = document.getElementById('connPill');
const roomPill = document.getElementById('roomPill');
const countPill = document.getElementById('countPill');

const joinForm = document.getElementById('joinForm');
const nameInput = document.getElementById('nameInput');
const roomInput = document.getElementById('roomInput');

const messages = document.getElementById('messages');
const msgForm = document.getElementById('msgForm');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

const typingIndicator = document.getElementById('typingIndicator');

const socket = io();

let currentRoom = null;
let currentName = null;
let typingTimer = null;
let remoteTypingSet = new Set();

function setConnState(isConnected) {
  connPill.classList.toggle('pill-ok', isConnected);
  connPill.classList.toggle('pill-bad', !isConnected);
  connPill.textContent = isConnected ? 'Connected' : 'Disconnected';
}

function setRoom(room) {
  roomPill.textContent = room ? `Room: ${room}` : 'Room: —';
  currentRoom = room;
}

function setCount(count) {
  countPill.textContent = Number.isFinite(count) ? `Online: ${count}` : 'Online: —';
}

function addSystemMessage(text) {
  const li = document.createElement('li');
  li.className = 'msg sys';
  li.textContent = text;
  messages.appendChild(li);
  li.scrollIntoView({ block: 'end' });
}

function addChatMessage({ name, at, text }) {
  const li = document.createElement('li');
  li.className = 'msg';

  const top = document.createElement('div');
  top.className = 'msgTop';

  const who = document.createElement('div');
  who.className = 'msgName';
  who.textContent = name;

  const meta = document.createElement('div');
  meta.className = 'msgMeta';
  meta.textContent = new Date(at).toLocaleTimeString();

  const body = document.createElement('div');
  body.className = 'msgText';
  body.textContent = text;

  top.appendChild(who);
  top.appendChild(meta);

  li.appendChild(top);
  li.appendChild(body);
  messages.appendChild(li);
  li.scrollIntoView({ block: 'end' });
}

function updateTypingUI() {
  const names = [...remoteTypingSet];
  if (names.length === 0) {
    typingIndicator.textContent = '';
  } else if (names.length === 1) {
    typingIndicator.textContent = `${names[0]} is typing…`;
  } else {
    typingIndicator.textContent = `${names.slice(0, 2).join(', ')} are typing…`;
  }
}

function setChatEnabled(enabled) {
  msgInput.disabled = !enabled;
  sendBtn.disabled = !enabled;
  if (enabled) msgInput.focus();
}

socket.on('connect', () => {
  setConnState(true);
});

socket.on('disconnect', () => {
  setConnState(false);
  setChatEnabled(false);
  setRoom(null);
  setCount(NaN);
  addSystemMessage('Disconnected. Refresh or wait to reconnect.');
});

socket.on('room:joined', ({ room, name }) => {
  currentRoom = room;
  currentName = name;
  setRoom(room);
  setChatEnabled(true);
  addSystemMessage(`You joined "${room}" as ${name}.`);
});

socket.on('room:count', ({ room, count }) => {
  if (room && room === currentRoom) setCount(count);
});

socket.on('presence:joined', ({ name }) => {
  addSystemMessage(`${name} joined the room.`);
});

socket.on('presence:left', ({ name }) => {
  remoteTypingSet.delete(name);
  updateTypingUI();
  addSystemMessage(`${name} left the room.`);
});

socket.on('chat:message', (msg) => {
  remoteTypingSet.delete(msg.name);
  updateTypingUI();
  addChatMessage(msg);
});

socket.on('chat:typing', ({ name, isTyping }) => {
  if (!name || name === currentName) return;
  if (isTyping) remoteTypingSet.add(name);
  else remoteTypingSet.delete(name);
  updateTypingUI();
});

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const room = roomInput.value.trim();
  if (!name || !room) return;

  socket.emit('room:join', { name, room });
});

msgForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text || !currentRoom) return;
  socket.emit('chat:message', { text });
  msgInput.value = '';
  socket.emit('chat:typing', { isTyping: false });
});

msgInput.addEventListener('input', () => {
  if (!currentRoom) return;

  socket.emit('chat:typing', { isTyping: msgInput.value.trim().length > 0 });

  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    socket.emit('chat:typing', { isTyping: false });
  }, 1000);
});

