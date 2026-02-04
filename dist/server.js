"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./lib/db");
const socket_1 = require("./lib/socket");
const http_1 = __importDefault(require("http"));
const PORT = 5000;
const startServer = async () => {
    const server = http_1.default.createServer(app_1.default);
    await (0, db_1.mongoConnect)();
    (0, socket_1.initSocket)(server);
    app_1.default.get("/", (_req, res) => {
        res.json({ message: "Server is running" });
    });
    server.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
};
startServer();
