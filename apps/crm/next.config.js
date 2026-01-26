/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
