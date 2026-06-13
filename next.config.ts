import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve("."),
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};

export default nextConfig;
