"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const error_middleware_1 = require("./middlewares/error.middleware");
const imagekit_route_1 = __importDefault(require("./routes/imagekit.route"));
const webhooks_route_1 = __importDefault(require("./routes/webhooks.route"));
const buyer_auth_route_1 = __importDefault(require("./routes/buyer.auth.route"));
const farmer_auth_routes_1 = __importDefault(require("./routes/farmer.auth.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const negotiation_routes_1 = __importDefault(require("./routes/negotiation.routes"));
const waste_routes_1 = __importDefault(require("./routes/waste.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const express_2 = require("@clerk/express");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, dotenv_1.configDotenv)();
const corsOptions = {
    origin: ["http://localhost:3000", "https://smart-agriwaste.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use((0, express_2.clerkMiddleware)());
//routes
app.use("/api/imagekit", imagekit_route_1.default);
app.use("/api/webhooks", webhooks_route_1.default);
app.use("/api/buyer", buyer_auth_route_1.default);
app.use("/api/farmer", farmer_auth_routes_1.default);
app.use("/api/notification", notification_routes_1.default);
app.use("/api/negotiation", negotiation_routes_1.default);
app.use("/api/waste", waste_routes_1.default);
app.use("/api/order", order_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
