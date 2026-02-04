"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.getMessages = void 0;
const AppError_1 = require("../utils/AppError");
const Messages_model_1 = __importDefault(require("../models/Messages.model"));
const getMessages = async () => {
    const messages = await Messages_model_1.default.find({})
        .sort({ createdAt: 1 })
        .limit(50)
        .lean();
    if (!messages) {
        throw new AppError_1.AppError("No messages found", 404);
    }
    return messages;
};
exports.getMessages = getMessages;
const createMessage = async (data) => {
    if (!data.message) {
        throw new Error("Message is required");
    }
    return Messages_model_1.default.create({
        message: String(data.message).slice(0, 2000),
        username: data.username ? String(data.username).slice(0, 100) : "anonymous",
        userId: data.userid,
    });
};
exports.createMessage = createMessage;
