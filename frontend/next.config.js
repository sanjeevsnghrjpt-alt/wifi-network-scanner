/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;
