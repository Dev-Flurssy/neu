/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,

  experimental: {
    watchOptions: {
      pollIntervalMs: 1000,
    },
  },
};

export default nextConfig;
