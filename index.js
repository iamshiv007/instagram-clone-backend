const express = require('express');
require("dotenv").config()
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 4000
app.listen(port, (req, res) => {
    console.log(`Server is listen on http://localhost:${port}`)
})

app.get("/", (req, res) => {
    return res.send("Server testing: Hello from Instagram clone backend")
})