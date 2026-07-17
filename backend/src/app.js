const express = require ("express");
const cors = require("cors");
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const errorHandler = require("./middlewares/errorHandler")
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


console.log("✅ app.js Loaded");

const app = express();


// Security
app.use(helmet())

// Compression 
app.use(compression());

// Cors
app.use(cookieParser());
app.use(cors());


// Body Parser 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

app.get("/", (req , res) => {
    res.status(200).json({
        success: true,
        message: "SY Digital Backend is running successfully"
    });
});

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



app.use(errorHandler)

module.exports = app;