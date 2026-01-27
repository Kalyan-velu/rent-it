"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function generateToken(payload) {
    const { jwtSecret, jwtExpiresIn } = (0, config_1.loadAuthConfig)();
    return jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });
}
function verifyToken(token) {
    const { jwtSecret } = (0, config_1.loadAuthConfig)();
    try {
        return jsonwebtoken_1.default.verify(token, jwtSecret);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
}
function decodeToken(token) {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=jwt.js.map
