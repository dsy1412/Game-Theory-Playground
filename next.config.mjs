import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const framerMotionEntry = require.resolve("framer-motion");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.symlinks = false;
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "framer-motion": framerMotionEntry
    };
    return config;
  }
};

export default nextConfig;
