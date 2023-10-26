const express = require('express');
require("dotenv").config()
const cookieParser = require('cookie-parser');
const cloudinary = require("cloudinary").v2
const fileUpload = require("express-fileupload")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload())

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Connect to database
const connectDb = require("./database/db")
connectDb()

const port = process.env.PORT || 4000
app.listen(port, (req, res) => {
    console.log(`Server is listen on http://localhost:${port}`)
})

app.get("/", (req, res) => {
    return res.send("Server testing: Hello from Instagram clone backend")
})

// error middleware
const errorMiddleware  = require("./middleware/error")
app.use(errorMiddleware);