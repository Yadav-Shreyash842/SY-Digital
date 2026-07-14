const express = require ("express");
const cors = require("cors");
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const errorHandler = require("./middlewares/errorHandler")
const authRoutes = require("./routes/auth.routes");

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

app.use(errorHandler)

module.exports = app;