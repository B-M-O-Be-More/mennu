import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "@popperjs/core", "@mui/material"],
  },
};

export default nextConfig;
