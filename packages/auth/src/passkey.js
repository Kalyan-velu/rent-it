"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasskeyRegistrationOptions = generatePasskeyRegistrationOptions;
exports.verifyPasskeyRegistration = verifyPasskeyRegistration;
exports.generatePasskeyAuthenticationOptions = generatePasskeyAuthenticationOptions;
exports.verifyPasskeyAuthentication = verifyPasskeyAuthentication;
const server_1 = require("@simplewebauthn/server");
const RP_NAME = process.env.WEBAUTHN_RP_NAME || 'Rent-a-Wheel';
const RP_ID = process.env.WEBAUTHN_RP_ID || 'localhost';
const ORIGIN = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000';
/**
 * Generate passkey registration options for a user
 */
async function generatePasskeyRegistrationOptions(userId, userName, userEmail, existingCredentials = []) {
    const opts = {
        rpName: RP_NAME,
        rpID: RP_ID,
        userName: userEmail,
        userDisplayName: userName,
        userID: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
        attestationType: 'none',
        excludeCredentials: existingCredentials.map((cred) => ({
            id: Uint8Array.from(cred.id, (c) => c.charCodeAt(0)),
            type: 'public-key',
            transports: cred.transports,
        })),
        authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'preferred',
        },
    };
    return (0, server_1.generateRegistrationOptions)(opts);
}
/**
 * Verify passkey registration response
 */
async function verifyPasskeyRegistration(response, expectedChallenge) {
    return (0, server_1.verifyRegistrationResponse)({
        response,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
    });
}
/**
 * Generate passkey authentication options
 */
async function generatePasskeyAuthenticationOptions(credentials = []) {
    const opts = {
        rpID: RP_ID,
        allowCredentials: credentials.map((cred) => ({
            id: Uint8Array.from(cred.id, (c) => c.charCodeAt(0)),
            type: 'public-key',
            transports: cred.transports,
        })),
        userVerification: 'preferred',
    };
    return (0, server_1.generateAuthenticationOptions)(opts);
}
/**
 * Verify passkey authentication response
 */
async function verifyPasskeyAuthentication(response, expectedChallenge, credential) {
    return (0, server_1.verifyAuthenticationResponse)({
        response,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        credential: {
            id: Uint8Array.from(credential.id, (c) => c.charCodeAt(0)),
            publicKey: credential.publicKey,
            counter: credential.counter,
        },
    });
}
//# sourceMappingURL=passkey.js.map