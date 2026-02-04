"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWaste = exports.getSingleWaste = exports.deleteWaste = exports.getWaste = exports.getWastebyId = exports.addWaste = void 0;
const waste_model_1 = __importDefault(require("../models/waste.model"));
const azureTranslation_1 = require("../lib/azureTranslation");
const AppError_1 = require("../utils/AppError");
const addWaste = async (req, res) => {
    console.log("createwaste", req.headers);
    const data = await req.body;
    if (!data) {
        throw new AppError_1.AppError("Waste data not found", 500);
    }
    const title = await (0, azureTranslation_1.translateText)(data.title, ["en", "hi", "mr"]);
    const description = await (0, azureTranslation_1.translateText)(data.description, ["en", "hi", "mr"]);
    // Save documentnp
    const createdWaste = await waste_model_1.default.create({
        ...data,
        title,
        description,
        createdAt: new Date(), // timestamp
    });
    if (!createdWaste) {
        throw new AppError_1.AppError("Waste is not added", 500);
    }
    res.status(200).json({ status: "success" });
};
exports.addWaste = addWaste;
const getWastebyId = async (req, res) => {
    console.log(req.headers);
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const { cursor } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const query = cursor
        ? { "seller.farmerId": id, _id: { $lt: cursor } }
        : { "seller.farmerId": id };
    const wastedata = await waste_model_1.default
        .find(query)
        .sort({ _id: -1 })
        .limit(limit + 1);
    const hasNext = wastedata.length > limit;
    if (hasNext)
        wastedata.pop();
    if (!wastedata) {
        throw new AppError_1.AppError("Error occur while findidng waste", 500);
    }
    res.status(200).json({
        success: true,
        wastedata,
        pagination: {
            nextCursor: hasNext ? wastedata[wastedata.length - 1]._id : null,
            limit,
            hasNext,
        },
    });
};
exports.getWastebyId = getWastebyId;
const getWaste = async (req, res) => {
    const { cursor } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const query = cursor ? { _id: { $lt: cursor } } : {};
    const wastedata = await waste_model_1.default
        .find(query)
        .sort({ _id: -1 })
        .limit(limit + 1);
    const hasNext = wastedata.length > limit;
    if (hasNext)
        wastedata.pop();
    if (!wastedata) {
        throw new AppError_1.AppError("Error while fetching the waste", 500);
    }
    res.status(200).json({
        success: true,
        wastedata,
        pagination: {
            nextCursor: hasNext ? wastedata[wastedata.length - 1]._id : null,
            limit,
            hasNext,
        },
    });
};
exports.getWaste = getWaste;
const deleteWaste = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const deleted = await waste_model_1.default.findOneAndDelete({ _id: id });
    if (!deleted) {
        throw new AppError_1.AppError("Error while deleting the waste", 500);
    }
    res.status(200).json({ message: "Deleted successfully" });
};
exports.deleteWaste = deleteWaste;
const getSingleWaste = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const singleWaste = await waste_model_1.default.findById(id);
    if (!singleWaste) {
        throw new AppError_1.AppError("Can not fetch the single waste", 500);
    }
    return res.status(200).json({ singleWaste });
};
exports.getSingleWaste = getSingleWaste;
const updateWaste = async (req, res) => {
    const id = req.params.id;
    const data = await req.body.data;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    if (!data) {
        throw new AppError_1.AppError("Waste data not found", 500);
    }
    const title = await (0, azureTranslation_1.translateText)(data.title, ["en", "hi", "mr"]);
    const description = await (0, azureTranslation_1.translateText)(data.description, ["en", "hi", "mr"]);
    const updatedWaste = await waste_model_1.default.findByIdAndUpdate(id, { $set: { ...data, title, description } }, { new: true });
    if (!updatedWaste) {
        throw new AppError_1.AppError("Waste not updated", 500);
    }
    res.status(200).json({ message: "Waste updated successfully", updatedWaste });
};
exports.updateWaste = updateWaste;
