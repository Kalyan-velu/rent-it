export type AuthConfig = {
  jwtSecret: string;
  jwtExpiresIn: string;
};

let cachedConfig: AuthConfig | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function loadAuthConfig(): AuthConfig {
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
