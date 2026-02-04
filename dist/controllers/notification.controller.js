"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.updateRead = exports.getNotification = exports.sendNotification = void 0;
const AppError_1 = require("../utils/AppError");
const notification_model_1 = __importDefault(require("../models/notification.model"));
const sendNotification = async (req, res) => {
    const { userId, title, message, type } = await req.body.data;
    if (!userId || !title || !message) {
        throw new AppError_1.AppError("Insufficient data provided", 400);
    }
    const sendednotification = await notification_model_1.default.create({
        userId,
        title,
        message,
        type: type ?? "system",
        read: false,
    });
    if (!sendednotification) {
        throw new AppError_1.AppError("Failed to log notification", 500);
    }
    const options = {
        method: "POST",
        headers: {
            Authorization: `${process.env.ONESIGNAL_REST_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            app_id: process.env.ONESIGNAL_APP_ID,
            headings: { en: title },
            contents: { en: message },
            include_aliases: { external_id: [userId] },
            target_channel: "push",
        }),
    };
    await fetch("https://api.onesignal.com/notifications?c=push", options)
        .then((res) => {
        res.json();
    })
        .catch((err) => {
        throw new AppError_1.AppError("Failed to send notification", 500);
    });
    res.status(200).json({ message: "Notificaiton Sended Successfully" });
};
exports.sendNotification = sendNotification;
const getNotification = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const { cursor } = req.query;
    const limit = Math.min(parseInt(req.query.limit) | 10, 50);
    const query = cursor ? { userId: id, _id: { $lt: cursor } } : { userId: id };
    const notifications = await notification_model_1.default
        .find(query)
        .sort({
        _id: -1,
    })
        .limit(limit + 1);
    if (!notifications) {
        throw new AppError_1.AppError("Unable to get the notification", 500);
    }
    const hasNext = notifications.length > limit;
    if (hasNext)
        notifications.pop();
    res.status(200).json({
        success: true,
        notifications,
        pagination: {
            nextCursor: hasNext ? notifications[notifications.length - 1]._id : null,
            limit,
            hasNext,
        },
    });
};
exports.getNotification = getNotification;
const updateRead = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const readednotification = await notification_model_1.default.findByIdAndUpdate(id, {
        read: true,
    });
    if (!readednotification) {
        throw new AppError_1.AppError("Failed to read the notification", 500);
    }
    res.status(200).json({ success: true });
};
exports.updateRead = updateRead;
const deleteNotification = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const deletedNotification = await notification_model_1.default.findByIdAndDelete(id);
    if (!deletedNotification) {
        throw new AppError_1.AppError("Falied to delete Notification", 500);
    }
    res.status(200).json({ success: true });
};
exports.deleteNotification = deleteNotification;
