const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const users = {};

io.on("connection", socket => {

  socket.on("sendLocation", data => {
    users[socket.id] = { ...data, lastSeen: Date.now() };
    io.emit("locationBroadcast", users);
  });

  socket.on("stopTracking", () => {
    delete users[socket.id];
    io.emit("locationBroadcast", users);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("locationBroadcast", users);
  });
});

// Remove ghost users
setInterval(() => {
  const now = Date.now();
  for (let id in users) {
    if (now - users[id].lastSeen > 15000) delete users[id];
  }
  io.emit("locationBroadcast", users);
}, 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("Running on port " + PORT);
});
