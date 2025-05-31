/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn1.genspark.ai'],  // Add any domains you're loading images from
  },
};

module.exports = nextConfig;