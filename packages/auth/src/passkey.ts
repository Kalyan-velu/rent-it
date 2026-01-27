import type {
  AuthenticatorTransportFuture,
  GenerateAuthenticationOptionsOpts,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

const RP_NAME = process.env.WEBAUTHN_RP_NAME || 'Rent-a-Wheel';
const RP_ID = process.env.WEBAUTHN_RP_ID || 'localhost';
const ORIGIN = process.env.WEBAUTHN_ORIGIN || 'http://localhost:3000';

export interface PasskeyCredential {
  id: string;
  publicKey: Uint8Array;
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

/**
 * Helper to convert string to Uint8Array
 */
function stringToUint8Array(str: string): Uint8Array {
  return Uint8Array.from(Buffer.from(str, 'utf-8'));
}

/**
 * Generate passkey registration options for a user
 */
export async function generatePasskeyRegistrationOptions(
  userId: string,
  userName: string,
  userEmail: string,
  existingCredentials: PasskeyCredential[] = []
) {
  const opts: GenerateRegistrationOptionsOpts = {
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: userEmail,
    userDisplayName: userName,
    // Cast to any to avoid strict ArrayBuffer type issues
    userID: stringToUint8Array(userId) as any,
    attestationType: 'none',
    excludeCredentials: existingCredentials.map((cred) => ({
      id: cred.id,
      transports: cred.transports,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  };

  return generateRegistrationOptions(opts);
}

/**
 * Verify passkey registration response
 */
export async function verifyPasskeyRegistration(
  response: any,
  expectedChallenge: string
) {
  return verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
  });
}

/**
 * Generate passkey authentication options
 */
export async function generatePasskeyAuthenticationOptions(
  credentials: PasskeyCredential[] = []
) {
  const opts: GenerateAuthenticationOptionsOpts = {
    rpID: RP_ID,
    allowCredentials: credentials.map((cred) => ({
      id: cred.id,
      transports: cred.transports,
    })),
    userVerification: 'preferred',
  };

  return generateAuthenticationOptions(opts);
}

/**
 * Verify passkey authentication response
 */
export async function verifyPasskeyAuthentication(
  response: any,
  expectedChallenge: string,
  credential: PasskeyCredential
) {
  return verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    credential: {
      id: credential.id,
      // Cast to any to avoid strict ArrayBuffer type issues
      publicKey: credential.publicKey as any,
      counter: credential.counter,
    },
  });
}
