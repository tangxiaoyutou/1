const app = require("express")();
const httpServer = require("http").createServer(app);
const options = { /* ... */path: "" };
const io = require("socket.io")(httpServer);
let connectedUser = [];
io.on("connection", socket => {
    console.log("a user connected");
    io.emit("loadUser", connectedUser);
    let userName = "";

    let on = socket.on("login", (name, callback) => {
        callback(true);
        userName = name;
        connectedUser.push(userName);
        updateUserName();

    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        let index = connectedUser.indexOf(userName, 0);
        if (index !== -1) {
            connectedUser.splice(index, 1);
        }
        updateUserName();
    });

    socket.on("sendMsg", (name, textMsg) => {
        console.log(name + textMsg);
        io.emit("output", {
            n: name,
            chatMsg: textMsg
        });
    })
});
function updateUserName() {
    io.emit("loadUser", connectedUser);
}
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const port = process.env.PORT || 5000;

httpServer.listen(port, () => console.log('Server running on port', port));