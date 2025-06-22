const { Server } = require("socket.io");

let connections = {}; // Stores socket IDs for each room
let messages = {}; // Stores chat messages for each room
let timeOnline = {}; // Tracks join time for each socket

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

      // Add this socket to the room's connection list
      connections[path].push(socket.id);
      // Track when this user joined
      timeOnline[socket.id] = new Date();

      // Notify all users in the room about the new user
      connections[path].forEach((id) => {
        io.to(id).emit("user-joined", socket.id);
      });

      // Send previous chat messages to the new user
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

    // Handle WebRTC signaling messages
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // Handle incoming chat messages
    socket.on("chat-message", (data, sender) => {
      let matchingRoom = "";
      let found = false;

      // Find the room this socket belongs to
      for (const roomKey in connections) {
        const socketIds = connections[roomKey];
        if (socketIds.includes(socket.id)) {
          matchingRoom = roomKey;
          found = true;
          break;
        }
      }

      if (found) {
        // Initialize message list for the room if needed
        if (!messages[matchingRoom]) {
          messages[matchingRoom] = [];
        }

        // Store the new message
        messages[matchingRoom].push({
          sender,
          data,
          "socket-id-sender": socket.id,
        });
        console.log("message", matchingRoom, ":", sender, data);

        // Broadcast the message to all users in the room
        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      const disconnectTime = new Date();
      const connectedTime = timeOnline[socket.id];
      const onlineDuration = connectedTime
        ? Math.abs(disconnectTime - connectedTime)
        : 0;

      delete timeOnline[socket.id]; // Clean up memory

      let matchingRoom = "";

      for (const room in connections) {
        const index = connections[room].indexOf(socket.id);

        if (index !== -1) {
          matchingRoom = room;

          // Notify others in the room
          connections[room].forEach((socketId) => {
            io.to(socketId).emit("user-left", socket.id);
          });

          // Remove the user
          connections[room].splice(index, 1);

          // If room is empty, delete it
          if (connections[room].length === 0) {
            delete connections[room];
          }

          break; // Exit loop since we found the room
        }
      }

      console.log(
        `Socket ${socket.id} disconnected after ${
          onlineDuration / 1000
        } seconds from room ${matchingRoom}`
      );
    });
  });

  return io;
}

module.exports = { initSocket };
