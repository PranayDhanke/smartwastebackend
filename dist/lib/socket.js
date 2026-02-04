"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const messages_controller_1 = require("../controllers/messages.controller");
let io = null;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3000/", "https://smart-agriwaste.vercel.app/"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);
        setUser(socket);
    });
};
exports.initSocket = initSocket;
const setUser = (socket) => {
    socket.on("join-room", async () => {
        const ROOM = "main-room";
        socket.join(ROOM);
        const hisMes = await (0, messages_controller_1.getMessages)();
        socket.emit("history", hisMes);
    });
    socket.on("send-message", async (payload) => {
        try {
            if (!payload || !payload.message)
                return;
            const text = String(payload.message).slice(0, 2000);
            const username = payload.username
                ? String(payload.username).slice(0, 100)
                : "anonymous";
            const userid = payload.userid ? String(payload.userid) || "" : "";
            const saved = await (0, messages_controller_1.createMessage)({
                message: text,
                username,
                userid,
            });
            if (io === null)
                return;
            io.to("main-room").emit("receive-message", {
                _id: saved._id,
                message: saved.message,
                username: saved.username,
                userid: saved.userId,
                createdAt: saved.createdAt,
            });
        }
        catch (err) {
            console.error("send-message error:", err);
            socket.emit("send-error", { message: "Could not save/send message" });
        }
    });
    socket.on("leave-room", () => {
        socket.leave("main-room");
    });
    socket.on("disconnect", (reason) => {
        console.log("disconnect", socket.id, reason);
    });
};
