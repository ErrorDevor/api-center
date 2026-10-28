import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["172.25.107.9"],
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src")],
    additionalData: `
      @use "shared/styles/vars" as *;
      @use "shared/styles/mixins" as *;
    `,
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: true,
  },
  async redirects() {
    return [
      { source: "/forum", destination: "/discussions", permanent: true },
      { source: "/topics", destination: "/discussions", permanent: true },
      { source: "/password-reset", destination: "/reset-password", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;