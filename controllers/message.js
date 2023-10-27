const asyncHandler = require("../middlewares/asyncHandler");
const Message = require("../models/message");
const Chat = require("../models/chat");

// Send New Message
exports.newMessage = asyncHandler(async (req, res, next) => {

    const { chatId, content } = req.body;

    const msgData = {
        sender: req.user._id,
        chatId,
        content,
    }

    const newMessage = await Message.create(msgData);

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

    res.status(200).json({
        success: true,
        newMessage,
    });
});

// Get All Messages
exports.getMessages = asyncHandler(async (req, res, next) => {

    const messages = await Message.find({
        chatId: req.params.chatId
    });

    res.status(200).json({
        success: true,
        messages,
    });
});