import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  eslint: {
    dirs: ["src", "e2e", "testing"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.REMOTE_IMAGE_HOST || "",
      },
    ],
  },
};

export default nextConfig;
