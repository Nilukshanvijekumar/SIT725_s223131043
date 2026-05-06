# SIT725 7.2P — Socket Programming (Socket.IO)

This is an Express-based web app that uses Socket.IO for **real-time communication**.

## What’s the “variation” vs the workshop?

Instead of the workshop’s random number broadcast demo, this app implements:

- **Room join** (`room:join`, `room:joined`)
- **Room-scoped messages** (`chat:message`)
- **Typing indicator** (`chat:typing`)
- **Live room online count** (`room:count`)
- **Presence events** (`presence:joined`, `presence:left`)

## Run it

```bash
npm install
npm start
```

Open `http://localhost:3000` in **two tabs** (or two browsers), join the same room, and chat.

If port 3000 is busy, use another port:

```bash
set PORT=3001 && npm start
```

## Evidence screenshots (for submission PDF)

- App running in browser (show room, messages)
- Two clients interacting (two tabs) showing real-time updates
- Terminal showing the server started message (and port)

