import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Hide the Next.js DevTools indicator (the small black "N" circle in the corner)
  devIndicators: false,
};

export default nextConfig;
