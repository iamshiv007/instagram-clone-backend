const router = require("express").Router()

const userRoutes = require("./user")
router.use("/user", userRoutes)

const postRoutes = require("./post")
router.use("/post", postRoutes)

const messageRoutes = require("./message")
router.use("/message", messageRoutes)

const chatRoute = require("./chat")
router.use("/chat", chatRoute)

module.exports = router