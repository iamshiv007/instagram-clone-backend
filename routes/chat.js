const express = require('express');
const { newChat, getChats } = require('../controllers/chat');
const { isAuthenticated } = require('../middlewares/auth');

const router = express();

router.route("/new").post(isAuthenticated, newChat);
router.route("/my").get(isAuthenticated, getChats);

module.exports = router;