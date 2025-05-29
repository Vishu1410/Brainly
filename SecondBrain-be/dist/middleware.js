"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware = (req, res, next) => {
    const token = req.headers["authorization"];
    //@ts-ignore
    const verifyToken = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRATE);
    if (verifyToken) {
        //@ts-ignore
        req.userId = verifyToken.id;
        next();
    }
    else {
        res.json({
            message: "your not authorized..."
        });
    }
};
exports.middleware = middleware;
