/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    "@repo/design-system",
    "@repo/tailwind-config",
    "@repo/analytics",
    "@repo/observability",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = config 