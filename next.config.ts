import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import path from "node:path";

function resolveTurbopackRoot() {
  const worktreeMarker = `${path.sep}.worktrees${path.sep}`;

  if (!__dirname.includes(worktreeMarker)) {
    return path.resolve(__dirname);
  }

  return path.resolve(__dirname.split(worktreeMarker)[0]);
}

const nextConfig: NextConfig = {
  turbopack: {
    root: resolveTurbopackRoot(),
  },
  webpack: (config, { isServer }) => {
    // Optimize webpack cache serialization for large strings
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          payload: {
            test: /[\\/]node_modules[\\/]@payloadcms[\\/]/,
            name: "payload-vendor",
            chunks: "all",
            priority: 10,
          },
        },
      },
    };

    // Handle large assets more efficiently
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext]",
      },
    });

    return config;
  },
  // Optimize build performance
  experimental: {
    optimizePackageImports: ["@payloadcms/next", "@chakra-ui/react"],
    webpackBuildWorker: true,
  },
  // Reduce bundle size and improve caching
  output: "standalone",
  compress: true,
};

export default withPayload(nextConfig);
