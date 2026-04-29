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
};

export default withPayload(nextConfig);
