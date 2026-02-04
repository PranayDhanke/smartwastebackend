"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongo_uri = process.env.MONGO_URI;
if (!mongo_uri) {
    console.log("MongoDB URI is not defined");
    process.exit(1);
}
const mongoConnect = async () => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            return mongoose_1.default.connection;
        }
        await mongoose_1.default.connect(mongo_uri);
        console.log("MongoDB connected");
    }
    catch {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
};
exports.mongoConnect = mongoConnect;
