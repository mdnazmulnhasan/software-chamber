// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
};

module.exports = nextConfig;


























// import type { NextConfig } from "next";

// const isProd = process.env.NODE_ENV === "production";
// const REPO = "software-chamber"; // ⬅️ shudhu repo name

// const nextConfig: NextConfig = {
//   output: "export", // static output
//   basePath: isProd ? `/${REPO}` : "",
//   assetPrefix: isProd ? `/${REPO}/` : "",
//   trailingSlash: true, // optional
//   images: {
//     unoptimized: true, // static export e image optimizer off
//   },
// };

// export default nextConfig;

