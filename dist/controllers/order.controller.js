"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewOrder = exports.setOutForDelivery = exports.getOrderFarmer = exports.getOrderBuyer = exports.confirmDelivery = exports.cancelOrder = exports.confirmOrder = exports.addOrder = void 0;
const AppError_1 = require("../utils/AppError");
const waste_model_1 = __importDefault(require("../models/waste.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const addOrder = async (req, res) => {
    const data = await req.body.data;
    if (!data) {
        throw new AppError_1.AppError("Waste data not found", 500);
    }
    if (!Array.isArray(data) || data.length === 0) {
        throw new AppError_1.AppError("Order data not found", 500);
    }
    const createdOrders = [];
    for (const frontendOrder of data) {
        let totalAmount = 0;
        const validatedItems = [];
        for (const item of frontendOrder.items) {
            const waste = await waste_model_1.default.findById(item.prodId);
            if (!waste) {
                throw new AppError_1.AppError("Waste item not found", 404);
            }
            totalAmount += waste.price * item.quantity;
            validatedItems.push({
                prodId: waste._id,
                title: waste.title,
                wasteType: waste.wasteType,
                wasteProduct: waste.wasteProduct,
                moisture: waste.moisture,
                quantity: item.quantity,
                price: waste.price,
                unit: waste.unit,
                description: waste.description,
                image: waste.imageUrl,
                sellerInfo: {
                    seller: {
                        farmerId: waste.seller?.farmerId,
                        farmerName: waste.seller?.name,
                    },
                    address: waste.address,
                },
            });
        }
        const order = await order_model_1.default.create({
            buyerId: frontendOrder.buyerId,
            farmerId: frontendOrder.farmerId,
            items: validatedItems,
            totalAmount,
            deliveryMode: frontendOrder.deliveryMode,
            buyerInfo: frontendOrder.buyerInfo,
            // backend controlled
            status: "pending",
            hasPayment: false,
            isDelivered: false,
            isOutForDelivery: false,
            paymentId: "",
        });
        createdOrders.push(order);
    }
    res.status(201).json({
        message: "Order(s) placed successfully",
        count: createdOrders.length,
        orders: createdOrders,
    });
};
exports.addOrder = addOrder;
const confirmOrder = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { orderId } = req.params;
        if (!orderId) {
            throw new AppError_1.AppError("Id not Provided", 500);
        }
        /**
         * 1️⃣ Fetch order (only pending + owned by farmer)
         */
        const order = await order_model_1.default
            .findOne({
            _id: orderId,
            status: "pending",
        })
            .session(session);
        if (!order) {
            throw new AppError_1.AppError("Order not found or already processed", 404);
        }
        /**
         * 2️⃣ Validate stock for ALL items
         */
        for (const item of order.items) {
            const waste = await waste_model_1.default.findById(item.prodId).session(session);
            if (!waste) {
                throw new AppError_1.AppError("Waste item not found", 404);
            }
            if (!waste.isActive) {
                throw new AppError_1.AppError(`${item.title} is out of stock`, 409);
            }
            if (waste.quantity < item.quantity) {
                throw new AppError_1.AppError(`Insufficient quantity for ${item.title}`, 409);
            }
        }
        /**
         * 3️⃣ Reduce stock (ATOMIC)
         */
        for (const item of order.items) {
            await waste_model_1.default.updateOne({ _id: item.prodId }, { $inc: { quantity: -item.quantity } }, { session });
            // Check if stock hits zero → mark out of stock
            const updatedWaste = await waste_model_1.default
                .findById(item.prodId)
                .session(session);
            if (updatedWaste && updatedWaste.quantity === 0) {
                await waste_model_1.default.updateOne({ _id: item.prodId }, { isActive: false }, { session });
            }
        }
        /**
         * 4️⃣ Update order status
         */
        order.status = "confirmed";
        await order.save({ session });
        /**
         * 5️⃣ Commit transaction
         */
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            message: "Order confirmed successfully",
            orderId: order._id,
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error); // ✅ handled by global AppError handler
    }
};
exports.confirmOrder = confirmOrder;
const cancelOrder = async (req, res, next) => {
    const { orderId } = req.params;
    if (!orderId) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    await order_model_1.default.findByIdAndUpdate(orderId, { status: "cancelled" }, { new: true });
};
exports.cancelOrder = cancelOrder;
const confirmDelivery = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    await order_model_1.default.findByIdAndUpdate(id, { isDelivered: true }, { new: true });
    res.status(200).json("Order has been successfully delivered");
};
exports.confirmDelivery = confirmDelivery;
const getOrderBuyer = async (req, res) => {
    const { cursor } = req.query;
    const limit = Math.min(parseInt(req.query.limit) | 10, 50);
    const buyerId = req.params.id;
    if (!buyerId) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const query = cursor ? { buyerId, _id: { $lt: cursor } } : { buyerId };
    const orderdata = await order_model_1.default
        .find(query)
        .sort({ _id: -1 })
        .limit(limit + 1);
    const hasNext = orderdata.length > limit;
    if (hasNext)
        orderdata.pop();
    res.status(200).json({
        success: true,
        orderdata,
        pagination: {
            nextCursor: hasNext ? orderdata[orderdata.length - 1]._id : null,
            limit,
            hasNext,
        },
    });
};
exports.getOrderBuyer = getOrderBuyer;
const getOrderFarmer = async (req, res) => {
    const { cursor } = req.query;
    const limit = Math.min(parseInt(req.query.limit) | 10, 50);
    const farmerId = req.params.id;
    if (!farmerId) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const query = cursor ? { farmerId, _id: { $lt: cursor } } : { farmerId };
    const orderdata = await order_model_1.default
        .find(query)
        .sort({ _id: -1 })
        .limit(limit + 1);
    const hasNext = orderdata.length > limit;
    if (hasNext)
        orderdata.pop();
    res.status(200).json({
        success: true,
        orderdata,
        pagination: {
            nextCursor: hasNext ? orderdata[orderdata.length - 1]._id : null,
            limit,
            hasNext,
        },
    });
};
exports.getOrderFarmer = getOrderFarmer;
const setOutForDelivery = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    await order_model_1.default.findByIdAndUpdate(id, { isOutForDelivery: true }, { new: true });
    res.status(200).json("Order has been set Out for delivery");
};
exports.setOutForDelivery = setOutForDelivery;
const viewOrder = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.AppError("Id not Provided", 500);
    }
    const orderdata = await order_model_1.default.findById(id);
    res.status(200).json({ orderdata });
};
exports.viewOrder = viewOrder;
