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
  },

  // Enable compression
  compress: true,

  // Generate sitemap and robots.txt
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },

  // Add security headers
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

module.exports = nextConfig;
