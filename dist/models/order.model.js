"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const translatedStringSchema = {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    mr: { type: String, required: true },
};
const OrderSchema = new mongoose_1.Schema({
    buyerId: { type: String, required: true },
    hasPayment: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    farmerId: { type: String, required: true },
    isOutForDelivery: { type: Boolean, required: true, default: false },
    totalAmount: { type: Number, required: true },
    deliveryMode: { type: String, required: true },
    paymentId: { type: String, required: false },
    buyerInfo: {
        buyerMobile: { type: String, required: true },
        buyerName: { type: String, required: true },
        address: {
            houseBuildingName: { type: String, required: true },
            roadarealandmarkName: { type: String, required: true },
            state: { type: String, required: true },
            district: { type: String, required: true },
            taluka: { type: String, required: true },
            village: { type: String, required: true },
        },
    },
    items: [
        {
            prodId: { type: String, required: true },
            title: translatedStringSchema,
            wasteType: { type: String, required: true },
            wasteProduct: { type: String, required: true },
            moisture: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            unit: { type: String, required: true },
            description: translatedStringSchema,
            image: { type: String, required: true },
            sellerInfo: {
                seller: {
                    farmerId: { type: String, required: true },
                    farmerName: { type: String, required: true },
                },
                address: {
                    houseBuildingName: { type: String, required: true },
                    roadarealandmarkName: { type: String, required: true },
                    state: { type: String, required: true },
                    district: { type: String, required: true },
                    taluka: { type: String, required: true },
                    village: { type: String, required: true },
                },
            },
        },
    ],
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", OrderSchema);
