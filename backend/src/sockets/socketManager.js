const { Server } = require("socket.io");

let connections = {};
let messages = {};
let timeOnline = {};

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (path) => {
      if (!path || typeof path !== "string") return;

      // Initialize connection list for this room if not exists
      if (!connections[path]) {
        connections[path] = [];
      }

      // Save socket ID to room list
      connections[path].push(socket.id);
      // Track join time
      timeOnline[socket.id] = new Date();

      // Notify all users in this room about the new user
      connections[path].forEach((id) => {
        io.to(id).emit("user-joined", socket.id);
      });

      // Send past chat messages to the new user
      if (messages[path]) {
        messages[path].forEach((item) => {
          io.to(socket.id).emit(
            "chat-message",
            item.data,
            item.sender,
            item["socket-id-sender"]
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {});

    socket.on("diconnect", () => {});
  });

  return io;
}

module.exports = { initSocket };
