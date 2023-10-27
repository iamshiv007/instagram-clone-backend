const express = require('express');
const { newMessage, getMessages } = require('../controllers/message');
const { isAuthenticated } = require('../middlewares/auth');

const router = express();

router.route("/new").post(isAuthenticated, newMessage);
router.route("/:chatId").get(isAuthenticated, getMessages);

module.exports = router;