const mongoose = require("mongoose");
const logger = require("../middlewares/logger");

const connectDB = async () => {
    try {

        const connection = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 50,
            minPoolSize: 5,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
        });

        logger.info(`🍃 MongoDB Connected: ${connection.connection.host}`);

    } catch (error) {

        logger.error(`❌ MongoDB Connection Failed: ${error.message}`);

        process.exit(1);

    }
};

module.exports = connectDB;