"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./utilis/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const Oauth_routes_1 = __importDefault(require("./routes/Oauth.routes"));
dotenv_1.default.config();
const portEnv = process.env.PORT;
if (!portEnv) {
    console.error("Error:PORT is not defined in .env file");
    process.exit(1);
}
const PORT = parseInt(portEnv, 10);
const app = (0, express_1.default)();
const corsOption = {
    origin: "*",
    Credential: true,
    allowedHeaders: "*",
    methods: "GET, PUT, HEAD, PATCH, POST, DELETE"
};
app.use((0, cors_1.default)(corsOption));
app.use(express_1.default.json());
app.use("/api/v1/auth", Oauth_routes_1.default),
    app.use("/api/v1/login", auth_routes_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
