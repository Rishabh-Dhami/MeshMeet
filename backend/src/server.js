const http = require("http");
const { app } = require("./app.js");
const { connectDB } = require("./database/db.js");
const { initSocket } = require("./sockets/socketManager.js");

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log("server is running");
  });
});

const io = initSocket(server);

module.exports = { server, io };
