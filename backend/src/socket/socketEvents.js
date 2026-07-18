const {
    joinAdminRoom,
    joinClientRoom,
} = require("./socketRooms");

const logger = require("../middlewares/logger");

const registerSocketEvents = (io, socket) => {

    if (socket.user.role === "admin") {
        joinAdminRoom(socket);
    } else {
        joinClientRoom(socket);
    }

    logger.info(`⚡ Events Registered for ${socket.id}`);

    socket.on("ping", () => {
        socket.emit("pong", {
            message: "Server is alive",
        });
    });

};

module.exports = registerSocketEvents;