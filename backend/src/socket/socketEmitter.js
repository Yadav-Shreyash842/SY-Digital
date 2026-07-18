const { getIO } = require("./index");

/**
 * Emit an event to all connected admins.
 */
const emitToAdmins = (event, data) => {
    const io = getIO();

    io.to("admins").emit(event, data);
};

/**
 * Emit an event to a specific client.
 */
const emitToClient = (clientId, event, data) => {
    const io = getIO();

    io.to(`client:${clientId}`).emit(event, data);
};

/**
 * Emit an event to everyone.
 */
const emitToAll = (event, data) => {
    const io = getIO();

    io.emit(event, data);
};

/**
 * Emit an event to any custom room.
 */
const emitToRoom = (room, event, data) => {
    const io = getIO();

    io.to(room).emit(event, data);
};

module.exports = {
    emitToAdmins,
    emitToClient,
    emitToAll,
    emitToRoom,
};