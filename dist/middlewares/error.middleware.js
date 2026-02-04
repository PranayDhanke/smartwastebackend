"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = async (err, _req, res, _next) => {
    let status = 500;
    let message = "Internal Server Error";
    if (err instanceof AppError_1.AppError) {
        status = err.statusCode || 500;
        message = err.message;
    }
    console.log("Error:", err);
    res.status(status).json({ error: message });
};
exports.errorHandler = errorHandler;
