const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const users = {}; // socket.id -> user data

io.on("connection", socket => {
  console.log("Connected:", socket.id);

  socket.on("sendLocation", data => {
    users[socket.id] = {
      user: data.user,
      lat: data.lat,
      lng: data.lng,
      time: Date.now()
    };

    io.emit("locationBroadcast", Object.values(users));
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("locationBroadcast", Object.values(users));
  });
});

// Remove dead users (if GPS closed)
setInterval(() => {
  const now = Date.now();
  for (let id in users) {
    if (now - users[id].time > 15000) {
      delete users[id];
    }
  }
  io.emit("locationBroadcast", Object.values(users));
}, 5000);

const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
