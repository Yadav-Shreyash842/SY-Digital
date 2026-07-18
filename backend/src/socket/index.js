const { Server } = require("socket.io");
const registerSocketEvents = require("./socketEvents");
const socketMiddleware = require("./socketMiddleware");
const logger = require("../middlewares/logger");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.use(socketMiddleware);

    io.on("connection", (socket) => {

        logger.info(`🟢 Socket Connected: ${socket.id}`);

        registerSocketEvents(io, socket);

        socket.on("disconnect", () => {

            logger.info(`🔴 Socket Disconnected: ${socket.id}`);

        });

    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO,
};