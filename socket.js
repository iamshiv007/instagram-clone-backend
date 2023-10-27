const { addUser, getUser, users, removeUser } = require("./user");

module.exports = function (server) {
    const io = require("socket.io")(server, {
        cors: {
            "Access-Control-Allow-Origin": process.env.FRONTEND_URL
        }
    });

    io.on("connection", (socket) => {
        console.log("🚀 Someone connected!");
        // console.log(users);

        // get userId and socketId from client
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        });

        // get and send message
        socket.on("sendMessage", ({ senderId, receiverId, content }) => {

            const user = getUser(receiverId);

            io.to(user?.socketId).emit("getMessage", {
                senderId,
                content,
            });
        });

        // typing states
        socket.on("typing", ({ senderId, receiverId }) => {
            const user = getUser(receiverId);
            console.log(user)
            io.to(user?.socketId).emit("typing", senderId);
        });

        socket.on("typing stop", ({ senderId, receiverId }) => {
            const user = getUser(receiverId);
            io.to(user?.socketId).emit("typing stop", senderId);
        });

        // user disconnected
        socket.on("disconnect", () => {
            console.log("⚠️ Someone disconnected")
            removeUser(socket.id);
            io.emit("getUsers", users);
            // console.log(users);
        });
    })
}