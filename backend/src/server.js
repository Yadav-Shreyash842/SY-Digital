require("dotenv").config();
require("./config/env");

const http = require("http");

const app = require("./app");
const connectDB = require("./database/connection");
const logger = require("./middlewares/logger");

const { initializeSocket, getIO } = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
    try {

        await connectDB();

        server.listen(PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${PORT}`);
            logger.info("⚡ Socket.IO initialized");
        });

    } catch (error) {

        logger.error({ message: error.message, stack: error.stack });

        process.exit(1);

    }
};

startServer();

/**
 * Unhandled Promise Rejection
 */
process.on("unhandledRejection", (error) => {

    logger.error({ message: `Unhandled Rejection: ${error.message}`, stack: error.stack });

    server.close(() => {
        process.exit(1);
    });

});

/**
 * Uncaught Exception
 */
process.on("uncaughtException", (error) => {

    logger.error({ message: `Uncaught Exception: ${error.message}`, stack: error.stack });

    process.exit(1);

});

/**
 * Graceful Shutdown
 */
const gracefulShutdown = (signal) => {

    logger.info(`${signal} received. Shutting down server...`);

    server.close(async () => {

        try {

            await require("mongoose").connection.close();

            logger.info("MongoDB connection closed.");

            try {
                getIO().close();
                logger.info("Socket.IO closed.");
            } catch (_) {
                // io not initialized — safe to ignore
            }

            process.exit(0);

        } catch (error) {

            logger.error({ message: error.message, stack: error.stack });

            process.exit(1);

        }

    });

};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));