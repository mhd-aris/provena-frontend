import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      // Ignore server-side modules - redirect to empty module
      "why-is-node-running": path.resolve(__dirname, "empty-module.js"),
      "pino": path.resolve(__dirname, "empty-module.js"),
      "pino-pretty": path.resolve(__dirname, "empty-module.js"),
      "thread-stream": path.resolve(__dirname, "empty-module.js"),
    },
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
};

export default nextConfig;
