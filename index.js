const express = require('express');
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const cookieParser = require('cookie-parser');
const cloudinary = require("cloudinary").v2
const { createServer } = require("http")
require("dotenv").config()
const cors = require("cors")

const app = express();
const server = createServer(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

// Cloudinary configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Connect to database
const connectDb = require("./database/db")
connectDb()

// Server listen
const port = process.env.PORT || 4000
server.listen(port, (req, res) => {
    console.log(`Server is listen on http://localhost:${port}`)
})

// All routes
const routes = require("./routes/router")
app.use("/api", routes)

// Test server
app.get("/", (req, res) => {
    return res.send("Server testing: Hello from Instagram clone backend")
})
app.get("/test", (req, res) => {
    return res.send("Server testing: Hello from Instagram clone backend")
})

// error middleware
const errorMiddleware = require("./middlewares/error")
app.use(errorMiddleware);

const socketSetup = require("./socket")
socketSetup(server)