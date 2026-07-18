module.exports = {
    apps: [
        {
            name: "sy-digital-backend",
            script: "src/server.js",
            instances: "max",
            exec_mode: "cluster",
            env_production: {
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],
};
