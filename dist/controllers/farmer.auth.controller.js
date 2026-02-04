"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFarmerAccount = exports.getFarmerAccount = exports.createFarmerAccount = void 0;
const farmer_model_1 = __importDefault(require("../models/farmer.model"));
const AppError_1 = require("../utils/AppError");
const createFarmerAccount = async (req, res) => {
    const data = await req.body;
    if (!data) {
        throw new AppError_1.AppError("No data provided", 400);
    }
    const newFarmerAccount = await farmer_model_1.default.create({
        ...data,
    });
    if (!newFarmerAccount) {
        throw new AppError_1.AppError("Failed to create farmer profile", 500);
    }
    res.status(201).json({ status: "Profile created successfully " });
};
exports.createFarmerAccount = createFarmerAccount;
const getFarmerAccount = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("No farmer ID provided", 400);
    }
    const accountdata = await farmer_model_1.default.findOne({ farmerId: id });
    if (!accountdata) {
        throw new AppError_1.AppError("Farmer profile not found", 404);
    }
    res.status(200).json({ accountdata });
};
exports.getFarmerAccount = getFarmerAccount;
const updateFarmerAccount = async (req, res) => {
    const data = await req.body.data;
    const id = req.params.id;
    if (!data || !id) {
        throw new AppError_1.AppError("Insufficient data provided", 400);
    }
    const updated = await farmer_model_1.default.findOneAndUpdate({ farmerId: id }, { ...data }, {
        new: true,
    });
    if (!updated) {
        throw new AppError_1.AppError("Failed to update farmer profile", 500);
    }
    res.status(200).json({ message: "Updated Farmer Profile", data: updated });
};
exports.updateFarmerAccount = updateFarmerAccount;
