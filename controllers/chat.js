const asyncHandler = require("../middlewares/asyncHandler");
const Chat = require("../models/chat")

// Create New Chat
exports.newChat = asyncHandler(async (req, res, next) => {

    const chatExists = await Chat.findOne({
        users: {
            $all: [req.user._id, req.body.receiverId]
        }
    });

    if (chatExists) {
        return res.status(200).json({
            success: true,
            newChat: chatExists
        });
    }

    const newChat = await Chat.create({
        users: [req.user._id, req.body.receiverId],
    });

    res.status(200).json({
        success: true,
        newChat
    });
});

// Get All Chats
exports.getChats = asyncHandler(async (req, res, next) => {

    const chats = await Chat.find(
        {
            users: {
                $in: [req.user._id]
            }
        }
    ).sort({ updatedAt: -1 }).populate("users latestMessage");

    res.status(200).json({
        success: true,
        chats
    });
});