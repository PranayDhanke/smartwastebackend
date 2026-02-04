"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imagekit_1 = __importDefault(require("../config/imagekit"));
const router = (0, express_1.Router)();
router.get("/auth", (_req, res) => {
    const authParams = imagekit_1.default.getAuthenticationParameters();
    res.status(200).json(authParams);
});
exports.default = router;
