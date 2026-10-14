import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Keeps the dev-mode badge out of source/local comparison screenshots.
  devIndicators: false,
  // Lets phones on the LAN load dev resources (HMR, /_next chunks) from the dev server.
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    // The source serves its backdrop at q=55, photography at q=75, and thumbnails at q=90.
    qualities: [55, 75, 90],
    // Optimised images are cached (by Next and by the Cloudflare Cache Rule on /_next/image) for 7 days instead of the
    // 4-hour default, matching the nginx cache lifetime of the originals in public/. File names don't change with
    // content yet, so keep this short enough that a replaced photo shows up within a week (or purge it on Cloudflare).
    minimumCacheTTL: 604800,
  },
  async redirects() {
    return [
      // The flip-book used to live here; keep the old URL working for existing links.
      { source: "/the-hot/menu", destination: "/menu", permanent: true },
    ];
  },
};

export default nextConfig;
