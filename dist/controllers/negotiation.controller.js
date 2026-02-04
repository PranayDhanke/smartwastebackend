"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNegotiationStatus = exports.getNegotiationsByBuyer = exports.getNegotiationsByFarmer = exports.listNegotiations = void 0;
const negotiation_model_1 = __importDefault(require("../models/negotiation.model"));
const AppError_1 = require("../utils/AppError");
const listNegotiations = async (req, res) => {
    const data = await req.body.data;
    if (!data) {
        throw new AppError_1.AppError("No data provided", 400);
    }
    const createdNegotiation = await negotiation_model_1.default.create({
        ...data,
        createdAt: new Date(),
    });
    if (!createdNegotiation) {
        throw new AppError_1.AppError("Failed to log negotiation request", 500);
    }
    res.status(200).json({ message: "Negotiation request logged successfully" });
};
exports.listNegotiations = listNegotiations;
const getNegotiationsByFarmer = async (req, res) => {
    const farmerId = req.params.id;
    if (!farmerId) {
        throw new AppError_1.AppError("No farmer ID provided", 400);
    }
    const { cursor, status, search, limit: limitRaw } = req.query;
    const limit = Math.min(Number(limitRaw) || 5, 50);
    const baseFilter = { farmerId };
    if (search) {
        baseFilter.$or = [
            { "item.title.en": { $regex: search, $options: "i" } },
            { buyerName: { $regex: search, $options: "i" } },
        ];
    }
    /* 🔢 GLOBAL STATS (no cursor!) */
    const [pending, accepted, rejected] = await Promise.all([
        negotiation_model_1.default.countDocuments({ ...baseFilter, status: "pending" }),
        negotiation_model_1.default.countDocuments({ ...baseFilter, status: "accepted" }),
        negotiation_model_1.default.countDocuments({ ...baseFilter, status: "rejected" }),
    ]);
    /* 🧠 PAGINATED QUERY (with status + cursor) */
    const pageFilter = { ...baseFilter };
    if (status)
        pageFilter.status = status;
    if (cursor)
        pageFilter._id = { $lt: cursor };
    const negotiations = await negotiation_model_1.default
        .find(pageFilter)
        .sort({ _id: -1 })
        .limit(limit + 1);
    const hasNext = negotiations.length > limit;
    if (hasNext)
        negotiations.pop();
    res.status(200).json({
        success: true,
        data: negotiations,
        stats: {
            pending,
            accepted,
            rejected,
            total: pending + accepted + rejected,
        },
        pagination: {
            hasNext,
            nextCursor: hasNext ? negotiations[negotiations.length - 1]._id : null,
            limit,
        },
    });
};
exports.getNegotiationsByFarmer = getNegotiationsByFarmer;
const getNegotiationsByBuyer = async (req, res) => {
    const buyerId = req.params.id;
    if (!buyerId) {
        throw new AppError_1.AppError("No farmer ID provided", 400);
    }
    const { cursor, status, search, limit: limitRaw } = req.query;
    const limit = Math.min(Number(limitRaw) || 5, 50);
    const baseFilter = { buyerId };
    if (search) {
        baseFilter.$or = [
            { "item.title.en": { $regex: search, $options: "i" } },
            { buyerName: { $regex: search, $options: "i" } },
        ];
    }
    /* 🔢 GLOBAL STATS (no cursor!) */
    const [pending, accepted, rejected] = await Promise.all([
        negotiation_model_1.default.countDocuments({ ...baseFilter, status: "pending" }),
        negotiation_model_1.default.countDocuments({ ...baseFilter, status: "accepted" }),
        negotiation_model_1.default.countDocuments({ ...baseFilter, status: "rejected" }),
    ]);
    /* 🧠 PAGINATED QUERY (with status + cursor) */
    const pageFilter = { ...baseFilter };
    if (status)
        pageFilter.status = status;
    if (cursor)
        pageFilter._id = { $lt: cursor };
    const negotiations = await negotiation_model_1.default
        .find(pageFilter)
        .sort({ _id: -1 })
        .limit(limit + 1);
    const hasNext = negotiations.length > limit;
    if (hasNext)
        negotiations.pop();
    res.status(200).json({
        success: true,
        data: negotiations,
        stats: {
            pending,
            accepted,
            rejected,
            total: pending + accepted + rejected,
        },
        pagination: {
            hasNext,
            nextCursor: hasNext ? negotiations[negotiations.length - 1]._id : null,
            limit,
        },
    });
};
exports.getNegotiationsByBuyer = getNegotiationsByBuyer;
const updateNegotiationStatus = async (req, res) => {
    const { id, status } = await req.body;
    if (!id || !status) {
        throw new AppError_1.AppError("Insufficient data provided", 400);
    }
    const updatedNegotiation = await negotiation_model_1.default.findByIdAndUpdate(id, {
        status: status,
    });
    if (!updatedNegotiation) {
        throw new AppError_1.AppError("Failed to update negotiation status", 500);
    }
    res.status(200).json({ success: true });
};
exports.updateNegotiationStatus = updateNegotiationStatus;
