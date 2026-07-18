const logger = require("../middlewares/logger");

const joinAdminRoom = (socket) => {
    socket.join("admins");
    logger.info(`👨‍💼 ${socket.user.firstName} joined admins room`);
};

const joinClientRoom = (socket) => {
    const room = `client:${socket.user._id}`;
    socket.join(room);
    logger.info(`👤 ${socket.user.firstName} joined ${room}`);
};

module.exports = {
    joinAdminRoom,
    joinClientRoom,
};