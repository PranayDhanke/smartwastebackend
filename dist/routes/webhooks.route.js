"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = require("express");
const clerkWebhook_controller_1 = require("../controllers/clerkWebhook.controller");
const router = (0, express_1.Router)();
router.post("/clerk", body_parser_1.default.raw({ type: "application/json" }), clerkWebhook_controller_1.handleClerkWebhook);
exports.default = router;
