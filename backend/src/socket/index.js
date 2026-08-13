const { Server } = require("socket.io");
const registerSocketEvents = require("./socketEvents");
const socketMiddleware = require("./socketMiddleware");
const logger = require("../middlewares/logger");

let io;

const getSocketAllowedOrigins = () => {
    const allowedOrigins = (process.env.CLIENT_URL || "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    if (process.env.NODE_ENV !== "production") {
        allowedOrigins.push("http://localhost:5173", "http://localhost:3000");
    }

    return allowedOrigins;
};

const initializeSocket = (server) => {
    const allowedOrigins = getSocketAllowedOrigins();

    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                if (allowedOrigins.includes(origin)) return callback(null, true);

                if (/\.vercel\.app$/.test(origin)) return callback(null, true);

                if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
                    return callback(null, true);
                }

                if (process.env.NODE_ENV !== "production" && /^https?:\/\/(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(origin)) {
                    return callback(null, true);
                }

                callback(new Error("Not allowed by CORS"));
            },
            methods: ["GET", "POST"],
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