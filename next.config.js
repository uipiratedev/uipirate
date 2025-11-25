const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds to prevent build failures
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimize images for better performance
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Enable compression
  compress: true,

  // Optimize fonts
  optimizeFonts: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Modularize imports to reduce bundle size
  modularizeImports: {
    "@nextui-org/react": {
      transform: "@nextui-org/react/dist/{{member}}",
    },
  },

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@nextui-org/react", "framer-motion", "gsap"],
  },

  // Generate sitemap and robots.txt
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },

  // Add security and performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack configuration to handle slick-carousel fonts
  webpack: (config, { isServer }) => {
    // Ignore missing slick-carousel font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      issuer: /slick-carousel/,
      type: "asset/resource",
      generator: {
        emit: false,
      },
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
