const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.IO logic
io.on("connection", socket => {
  console.log("User connected");

  socket.on("sendLocation", data => {
    io.emit("locationBroadcast", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 🚨 THIS PART IS CRITICAL FOR RENDER
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
