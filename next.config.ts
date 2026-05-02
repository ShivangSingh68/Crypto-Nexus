import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["https://unrimed-raiden-nonmedically.ngrok-free.dev"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Set your desired limit here
    },
  },
};

export default nextConfig;
