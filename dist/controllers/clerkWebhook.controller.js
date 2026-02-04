"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClerkWebhook = void 0;
const svix_1 = require("svix");
const buyer_model_1 = __importDefault(require("../models/buyer.model"));
const farmer_model_1 = __importDefault(require("../models/farmer.model"));
const Clerk_Webhook_Secret = process.env.CLERK_WEBHOOK_SECRET;
if (!Clerk_Webhook_Secret) {
    console.log("Clerk Webhook Secret is not defined");
}
const handleClerkWebhook = async (req, res) => {
    const payload = req.body;
    const header = req.headers;
    const svixHeaders = {
        "svix-id": header["svixid"],
        "svix-timestamp": header["svixtimestamp"],
        "svix-signature": header["svixsignature"],
    };
    let event;
    try {
        const webhook = new svix_1.Webhook(Clerk_Webhook_Secret);
        event = webhook.verify(payload, svixHeaders);
    }
    catch {
        return res.status(400).send("Invalid signature");
    }
    const { type, data } = event;
    switch (type) {
        case "user.updated":
            await handleUserUpdated(data);
            break;
    }
    res.status(200).json({ received: true });
};
exports.handleClerkWebhook = handleClerkWebhook;
const handleUserUpdated = async (data) => {
    const role = data.unsafe_metadata?.role;
    if (role === "farmer") {
        await farmer_model_1.default.findOneAndUpdate({ farmerId: data.id }, {
            firstName: data.first_name,
            lastName: data.last_name,
            username: data.username,
            email: data.email_addresses?.[0]?.email_address,
        }, { new: true });
    }
    if (role === "buyer") {
        await buyer_model_1.default.findOneAndUpdate({ buyerId: data.id }, {
            firstName: data.first_name,
            lastName: data.last_name,
            username: data.username,
            email: data.email_addresses?.[0]?.email_address,
        }, { new: true });
    }
};
