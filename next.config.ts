import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // Apply to all routes
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL", // Allow rendering in iframe
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *", // Optional: allow all origins to embed (or restrict to your domains)
          },
        ],
      },
    ];
  },
};

export default nextConfig;
