const express = require('express');
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const cookieParser = require('cookie-parser');
const cloudinary = require("cloudinary").v2
require("dotenv").config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(cookieParser());

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
app.listen(port, (req, res) => {
    console.log(`Server is listen on http://localhost:${port}`)
})

// All routes
const routes = require("./routes/router")
app.use("/api", routes)

// Test server
app.get("/", (req, res) => {
    return res.send("Server testing: Hello from Instagram clone backend")
})

// error middleware
const errorMiddleware = require("./middlewares/error")
app.use(errorMiddleware);