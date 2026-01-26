/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  // SWC minification is now default in Next.js 16
  // Production optimizations
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
