import { JWTPayload } from './types';
export declare function generateToken(payload: JWTPayload): string;
export declare function verifyToken(token: string): JWTPayload;
export declare function decodeToken(token: string): JWTPayload | null;
//# sourceMappingURL=jwt.d.ts.map