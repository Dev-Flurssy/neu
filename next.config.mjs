import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/.prisma/client/**",
      "./node_modules/@prisma/client/**",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
