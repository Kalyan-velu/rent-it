import type {
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
  transports?: string[];
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
    userID: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
    attestationType: 'none',
    excludeCredentials: existingCredentials.map((cred) => ({
      id: Uint8Array.from(cred.id, (c) => c.charCodeAt(0)),
      type: 'public-key',
      transports: cred.transports as any[],
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
      id: Uint8Array.from(cred.id, (c) => c.charCodeAt(0)),
      type: 'public-key',
      transports: cred.transports as any[],
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
      id: Uint8Array.from(credential.id, (c) => c.charCodeAt(0)),
      publicKey: credential.publicKey,
      counter: credential.counter,
    },
  });
}
