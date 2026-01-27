import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  transpilePackages: ['@rent-a-wheel/ui'],
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
