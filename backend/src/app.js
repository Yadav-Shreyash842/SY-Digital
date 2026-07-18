const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimiter = require("./middlewares/rateLimiter");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const serviceRoutes = require("./routes/service.routes");
const projectRoutes = require("./routes/project.routes");
const blogRoutes = require("./routes/blog.routes");
const meetingRoutes = require("./routes/meeting.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.routes");
const messageRoutes = require("./routes/message.routes");
const notificationRoutes = require("./routes/notification.routes");
const ApiError = require("./utils/ApiError");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();

// Security
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
    })
);

// Compression
app.use(compression());

// CORS
app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_URL];
if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push("http://localhost:5173", "http://localhost:3000");
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(mongoSanitize());
app.use(hpp());
app.use(rateLimiter);

// Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logging
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SY Digital Backend is running successfully",
    });
});

// Swagger Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Handler
app.use((req, res, next) => {
    next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

module.exports = app;