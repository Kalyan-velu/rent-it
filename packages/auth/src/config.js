"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAuthConfig = loadAuthConfig;
let cachedConfig = null;
function requireEnv(name) {
    const value = process.env[name];
    if (!value || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function loadAuthConfig() {
    if (cachedConfig) {
        return cachedConfig;
    }
    const jwtSecret = requireEnv('JWT_SECRET');
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    cachedConfig = {
        jwtSecret,
        jwtExpiresIn,
    };
    return cachedConfig;
}
