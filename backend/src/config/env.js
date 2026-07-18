const { cleanEnv, str, port, url } = require("envalid");

const env = cleanEnv(process.env, {
    NODE_ENV: str({
        default: "development",
        choices: ["development", "production", "test"],
    }),

    PORT: port({
        default: 3000,
    }),

    MONGO_URI: str(),

    JWT_SECRET: str(),

    JWT_EXPIRES_IN: str(),

    CLOUDINARY_CLOUD_NAME: str(),

    CLOUDINARY_API_KEY: str(),

    CLOUDINARY_API_SECRET: str(),

    EMAIL_USER: str(),

    EMAIL_PASS: str(),

    CLIENT_URL: str({ default: "http://localhost:5173" }),
});

module.exports = env;