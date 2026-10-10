import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Keeps the dev-mode badge out of source/local comparison screenshots.
  devIndicators: false,
  images: {
    // The source serves its backdrop at q=55, photography at q=75, and thumbnails at q=90.
    qualities: [55, 75, 90],
  },
};

export default nextConfig;
