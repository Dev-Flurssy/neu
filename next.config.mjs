/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "puppeteer-core",
    "@sparticuz/chromium-min",
    "@sparticuz/chromium",
  ],
};

export default nextConfig;
