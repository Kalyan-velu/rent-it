export interface PasskeyCredential {
    id: string;
    publicKey: Uint8Array;
    counter: number;
    transports?: string[];
}
/**
 * Generate passkey registration options for a user
 */
export declare function generatePasskeyRegistrationOptions(userId: string, userName: string, userEmail: string, existingCredentials?: PasskeyCredential[]): Promise<import("@simplewebauthn/server/script/deps").PublicKeyCredentialCreationOptionsJSON>;
/**
 * Verify passkey registration response
 */
export declare function verifyPasskeyRegistration(response: any, expectedChallenge: string): Promise<import("@simplewebauthn/server").VerifiedRegistrationResponse>;
/**
 * Generate passkey authentication options
 */
export declare function generatePasskeyAuthenticationOptions(credentials?: PasskeyCredential[]): Promise<import("@simplewebauthn/server/script/deps").PublicKeyCredentialRequestOptionsJSON>;
/**
 * Verify passkey authentication response
 */
export declare function verifyPasskeyAuthentication(response: any, expectedChallenge: string, credential: PasskeyCredential): Promise<import("@simplewebauthn/server").VerifiedAuthenticationResponse>;
//# sourceMappingURL=passkey.d.ts.map