"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBuyerAccount = exports.getBuyerAccount = exports.createBuyerAccount = void 0;
const buyer_model_1 = __importDefault(require("../models/buyer.model"));
const AppError_1 = require("../utils/AppError");
const createBuyerAccount = async (req, res) => {
    const data = await req.body;
    if (!data) {
        throw new AppError_1.AppError("No data provided", 400);
    }
    const created = await buyer_model_1.default.create({
        ...data,
    });
    if (!created) {
        throw new AppError_1.AppError("Failed to create buyer profile", 500);
    }
    res
        .status(200)
        .json({ message: "Profile created successfully ", data: created });
};
exports.createBuyerAccount = createBuyerAccount;
const getBuyerAccount = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("No buyer ID provided", 400);
    }
    const accountdata = await buyer_model_1.default.findOne({ buyerId: id });
    if (!accountdata) {
        throw new AppError_1.AppError("Buyer profile not found", 404);
    }
    res.status(200).json({ accountdata });
};
exports.getBuyerAccount = getBuyerAccount;
const updateBuyerAccount = async (req, res) => {
    const data = req.body.data;
    const id = req.params.id;
    if (!data || !id) {
        throw new AppError_1.AppError("Insufficient data provided", 400);
    }
    const updatedBuyer = await buyer_model_1.default.findOneAndUpdate({ buyerId: id }, { ...data }, {
        new: true,
    });
    if (!updatedBuyer) {
        throw new AppError_1.AppError("Failed to update buyer profile", 500);
    }
    res.status(200).json("Updated Buyer Profile");
};
exports.updateBuyerAccount = updateBuyerAccount;
