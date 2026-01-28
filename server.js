const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", socket => {
  console.log("User connected");

  socket.on("sendLocation", data => {
    socket.username = data.user;
    io.emit("locationBroadcast", data);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("userDisconnected", socket.username);
    }
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
